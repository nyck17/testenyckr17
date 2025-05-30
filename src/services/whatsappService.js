const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

// Controladores
const activationController = require('../controllers/activationController');
const expenseController = require('../controllers/expenseController');
const cardController = require('../controllers/cardController');
const reportController = require('../controllers/reportController');
const billController = require('../controllers/billController');

// Serviços
const backupService = require('./backupService');
const notificationService = require('./notificationService');

// Utilitários
const parser = require('../utils/parser');
const nlpProcessor = require('../utils/nlpProcessor');

// Configurações
const paths = require('../config/paths');

// Estado global
let botStartTime = null;
const conversationState = {};
const messageQueue = new Map();
const MESSAGE_COOLDOWN = 2000; // 2 segundos entre mensagens do mesmo usuário

// Sistema de logging detalhado
const logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    },
    error: (message, error) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    debug: (message, ...args) => {
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
};

// Padrões de reconhecimento de comandos
const commandPatterns = {
    card: {
        registration: [
            /quero\s+(?:cadastrar|registrar|adicionar)\s+(?:um\s+)?cartão/i,
            /cadastrar?\s+(?:novo\s+)?cartão/i,
            /adicionar?\s+(?:novo\s+)?cartão/i,
            /registrar?\s+(?:novo\s+)?cartão/i,
            /novo\s+cartão/i
        ],
        info: [
            /(?:meu\s+)?cartão\s+(\w+)\s+(?:tem|possui|com)\s+(\d+)/i,
            /tenho\s+(\d+)\s+(?:reais|conto|pila)\s+no\s+cartão\s+(\w+)/i,
            /(\w+)\s+(?:tem|possui|com)\s+(\d+)\s+(?:reais|conto|pila)/i,
            /cartão\s+(?:tem|possui|com)\s+saldo\s+(?:de\s+)?(\d+)/i,
            /saldo\s+(?:do|no)\s+cartão\s+(?:é|de)\s+(\d+)/i
        ],
        balance: [
            /quanto\s+(?:tem|há|existe|sobrou)\s+no\s+cartão/i,
            /saldo\s+(?:do|no)\s+cartão/i,
            /ver\s+saldo\s+(?:do|no)\s+cartão/i,
            /consultar?\s+(?:saldo\s+)?(?:do|no)\s+cartão/i
        ]
    },
    expense: {
        registration: [
            /gastei\s+(\d+)/i,
            /comprei\s+.+?\s+(?:por|de)\s+(\d+)/i,
            /paguei\s+(\d+)/i,
            /fiz\s+uma\s+compra\s+de\s+(\d+)/i,
            /(?:uma|um)\s+(?:compra|gasto|despesa)\s+de\s+(\d+)/i
        ]
    },
    report: {
        request: [
            /(?:ver|mostrar|exibir)\s+(?:meus\s+)?gastos/i,
            /relatório\s+(?:de\s+)?gastos/i,
            /quanto\s+(?:eu\s+)?gastei/i,
            /minhas\s+despesas/i,
            /meus\s+gastos/i
        ]
    },
    bill: {
        registration: [
            /(?:tenho|tem)\s+(?:uma\s+)?conta\s+(?:para|pra|de|do)\s+pagar/i,
            /(?:preciso|necessito)\s+pagar\s+(?:uma\s+)?conta/i,
            /registrar?\s+(?:uma\s+)?conta/i,
            /adicionar?\s+(?:uma\s+)?conta/i
        ]
    }
};

// Função para verificar padrões de comando
function checkCommandPatterns(message, patterns) {
    const lowerMessage = message.toLowerCase().trim();
    return patterns.some(pattern => pattern.test(lowerMessage));
}

// Função para extrair valores de mensagem
function extractValues(message) {
    const valuePatterns = [
        /R\$\s*(\d+(?:[.,]\d{2})?)/i,
        /(\d+(?:[.,]\d{2})?)\s*reais/i,
        /(\d+(?:[.,]\d{2})?)\s*(?:pila|conto)/i
    ];

    for (const pattern of valuePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            return parseFloat(match[1].replace(',', '.'));
        }
    }
    return null;
}

// Controle de rate limit
function isRateLimited(userId) {
    const lastMessage = messageQueue.get(userId);
    const now = Date.now();
    
    if (lastMessage && now - lastMessage < MESSAGE_COOLDOWN) {
        return true;
    }
    
    messageQueue.set(userId, now);
    return false;
}

// Classe para controle de semáforo
class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return Promise.resolve();
        }
        return new Promise(resolve => this.queue.push(resolve));
    }

    release() {
        this.count--;
        if (this.queue.length > 0) {
            this.count++;
            const next = this.queue.shift();
            next();
        }
    }
}

const messageSemaphore = new Semaphore(3); // Máximo de 3 mensagens sendo processadas simultaneamente
// Inicializa o bot do WhatsApp
async function startWhatsAppBot() {
    // Definir o momento em que o bot iniciou
    botStartTime = new Date();
    logger.info('Bot iniciando...', { startTime: botStartTime });

    // Garantir que as pastas existam
    paths.ensureDirectories();
    
    const { state, saveCreds } = await useMultiFileAuthState(paths.SESSIONS_DIR);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        defaultQueryTimeoutMs: undefined
    });
    
    // Lidar com atualizações de conexão
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
            logger.info('QR Code gerado para conexão');
        }
        
        if (connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.info('Conexão fechada', { shouldReconnect, error: lastDisconnect?.error });
            
            if (shouldReconnect) {
                startWhatsAppBot();
            }
        } else if (connection === 'open') {
            logger.info('Bot conectado ao WhatsApp!');
            setupScheduledTasks(sock);
        }
    });
    
    // Salvar credenciais quando atualizadas
    sock.ev.on('creds.update', saveCreds);
    
    // Processar mensagens recebidas
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const m of messages) {
            if (!m.message || m.key.fromMe) continue;
            
            const sender = m.key.remoteJid;
            if (!sender || sender.includes('@g.us')) continue;

            // Verificar timestamp
            const messageTimestamp = new Date(m.messageTimestamp * 1000);
            if (messageTimestamp < botStartTime) {
                logger.debug('Ignorando mensagem antiga', { timestamp: messageTimestamp });
                continue;
            }
            
            // Verificar rate limit
            if (isRateLimited(sender)) {
                logger.debug('Rate limit aplicado', { sender });
                continue;
            }

            // Adquirir semáforo
            await messageSemaphore.acquire();
            
            try {
                const messageText = m.message.conversation || 
                                (m.message.extendedTextMessage && m.message.extendedTextMessage.text) || 
                                '';
                
                logger.info('Mensagem recebida', { sender, message: messageText });

                const userName = activationController.getUserName(sender);
                const lowerMessage = messageText.toLowerCase().trim();

                // Verificar ativação primeiro
                if (!activationController.isUserActivated(sender)) {
                    if (await activationController.processActivation(sock, sender, messageText)) {
                        continue;
                    }
                    
                    if (messageText.toLowerCase() === 'comprar') {
                        await activationController.processPurchaseRequest(sock, sender);
                    } else {
                        await sock.sendMessage(sender, { 
                            text: `*❌ Acesso não autorizado*\n\nVocê precisa ativar o bot para utilizá-lo. Se quiser comprar uma chave de ativação, envie "comprar".` 
                        });
                    }
                    continue;
                }

                // Processamento de comandos
                let processed = false;

                // 1. Comandos de cartão
                if (checkCommandPatterns(messageText, commandPatterns.card.registration)) {
                    await sock.sendMessage(sender, {
                        text: `${userName}, me diga as informações do cartão assim:\n\n` +
                             `"Meu cartão [nome] tem [valor] reais"\n\n` +
                             `Por exemplo:\n` +
                             `"Meu cartão nubank tem 500 reais"`
                    });
                    processed = true;
                }
                else if (checkCommandPatterns(messageText, commandPatterns.card.info)) {
                    processed = await cardController.processCardManagement(sock, sender, messageText);
                }
                else if (checkCommandPatterns(messageText, commandPatterns.card.balance)) {
                    processed = await cardController.checkCardBalance(sock, sender);
                }

                // 2. Comandos de gastos
                else if (checkCommandPatterns(messageText, commandPatterns.expense.registration)) {
                    processed = await expenseController.processExpenseRecord(sock, sender, messageText);
                }

                // 3. Comandos de relatório
                else if (checkCommandPatterns(messageText, commandPatterns.report.request)) {
                    processed = await reportController.processReportRequest(sock, sender, messageText);
                }

                // 4. Comandos de contas
                else if (checkCommandPatterns(messageText, commandPatterns.bill.registration)) {
                    processed = await billController.processBillRecord(sock, sender, messageText);
                }

                // 5. Comandos simples
                else if (lowerMessage === 'ajuda' || lowerMessage === 'help') {
                    await sendHelpMessage(sock, sender);
                    processed = true;
                }
                else if (lowerMessage === 'status') {
                    processed = await reportController.processStatusRequest(sock, sender);
                }

                // Se nenhum comando foi reconhecido mas menciona cartão
                else if (lowerMessage.includes('cartão') || lowerMessage.includes('cartao')) {
                    await sock.sendMessage(sender, {
                        text: `${userName}, parece que você quer fazer algo com cartão. Você pode:\n\n` +
                             `1️⃣ Cadastrar um cartão:\n` +
                             `   "Meu cartão nubank tem 500 reais"\n\n` +
                             `2️⃣ Verificar saldo:\n` +
                             `   "Qual o saldo do meu cartão?"\n\n` +
                             `3️⃣ Registrar recarga:\n` +
                             `   "Meu cartão recarregou 600 reais"`
                    });
                    processed = true;
                }

                // Mensagem de não entendimento
                if (!processed) {
                    logger.debug('Comando não reconhecido', { message: messageText });
                    await sock.sendMessage(sender, {
                        text: `${userName}, não entendi bem o que você quer. Você pode:\n\n` +
                             `📝 Registrar gastos: "Gastei X reais em Y"\n` +
                             `💳 Gerenciar cartões: "Meu cartão tem X reais"\n` +
                             `📊 Ver relatórios: "Mostrar gastos do mês"\n` +
                             `⏰ Cadastrar contas: "Tenho uma conta para pagar"\n\n` +
                             `Digite "ajuda" para ver todos os comandos disponíveis.`
                    });
                }

            } catch (error) {
                logger.error('Erro ao processar mensagem', error);
                await sock.sendMessage(sender, {
                    text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.'
                });
            } finally {
                // Liberar semáforo
                messageSemaphore.release();
            }
        }
    });
    
    return sock;
}

// Função para enviar mensagem de ajuda
async function sendHelpMessage(sock, sender) {
    const userName = activationController.getUserName(sender);
    
    const helpText = `
*📚 Comandos Disponíveis - Olá, ${userName}!*

*💰 Registrar Gastos:*
- "Gastei 50 reais no mercado"
- "Paguei 30 no uber"
- "Comprei um lanche por 25"

*💳 Cartões e Saldos:*
- "Meu cartão nubank tem 500 reais"
- "Cartão VR tem recarga de 800 dia 5"
- "Ver saldo dos cartões"

*📊 Relatórios:*
- "Mostrar gastos do mês"
- "Quanto gastei esta semana?"
- "Ver gastos de hoje"

*📝 Contas a Pagar:*
- "Conta de luz 150 reais dia 10"
- "Lembrar do aluguel dia 5"
- "Ver minhas contas"

*❓ Outros Comandos:*
- "Status" - Ver resumo geral
- "Ajuda" - Ver esta mensagem

Use linguagem natural e fique à vontade para perguntar! 😊
`;

    await sock.sendMessage(sender, { text: helpText });
    return true;
}

// Configurar tarefas programadas
function setupScheduledTasks(sock) {
    // Verifica contas a pagar para todos os usuários ativos
    setInterval(async () => {
        logger.info('Verificando contas a pagar...');
        
        const users = require('../utils/fileManager').loadUsers();
        
        for (const [userId, userData] of Object.entries(users)) {
            if (!userData.isActive) continue;
            
            const dueBills = billController.checkDueBills(userId);
            
            for (const bill of dueBills) {
                await notificationService.sendBillReminder(sock, {
                    userId,
                    ...bill
                });
            }
        }
    }, 3600000); // Verifica a cada hora
    
    // Backup diário
    setInterval(async () => {
        logger.info('Criando backup do sistema...');
        await backupService.createFullBackup();
    }, 86400000); // 24 horas
    
    // Insights semanais
    setInterval(async () => {
        logger.info('Gerando insights para usuários...');
        
        const users = require('../utils/fileManager').loadUsers();
        
        for (const [userId, userData] of Object.entries(users)) {
            if (!userData.isActive) continue;
            
            try {
                const report = reportController.getUserReport(userId, 'month');
                
                if (report && report.transactions.length > 10) {
                    const sortedCategories = Object.entries(report.categorySummary)
                        .sort((a, b) => b[1].total - a[1].total);
                    
                    if (sortedCategories.length > 0) {
                        const [topCategory, data] = sortedCategories[0];
                        const percentage = (data.total / report.total * 100).toFixed(1);
                        
                        const insight = {
                            userId,
                            type: 'monthly_summary',
                            totalAmount: report.total,
                            topCategory,
                            topPercentage: percentage,
                            tip: 'Considere estabelecer limites de gastos para suas principais categorias.'
                        };
                        
                        await notificationService.sendInsight(sock, insight);
                    }
                }
            } catch (error) {
                logger.error(`Erro ao gerar insights para usuário ${userId}`, error);
            }
        }
    }, 604800000); // 7 dias
}

module.exports = {
    startWhatsAppBot
};