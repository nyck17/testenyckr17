const fileManager = require('../utils/fileManager');
const parser = require('../utils/parser');
const activationController = require('./activationController');

async function processCardManagement(sock, sender, message) {
    try {
        // Extrair dados do cartão
        const cardData = parser.extractCardData(message);
        const userName = activationController.getUserName(sender);

        if (!cardData) {
            await sock.sendMessage(sender, { 
                text: `${userName}, não consegui entender bem as informações do cartão. Tente algo como:\n\n` +
                      `✓ "Meu cartão nubank tem 500 reais"\n` +
                      `✓ "Cartão VR com saldo de 300"\n` +
                      `✓ "Cartão de crédito tem limite de 1000"\n` +
                      `✓ "Meu VA recarrega 600 todo dia 5"`
            });
            return false;
        }

        // Salvar ou atualizar o cartão
        const result = fileManager.saveCard(sender, cardData);

        // Mensagem de sucesso personalizada
        const successMessage = result === 'created' 
            ? `✅ ${userName}, cadastrei seu cartão com sucesso!\n\n` +
              `*💳 Detalhes do Cartão:*\n` +
              `📌 *Nome:* ${cardData.name}\n` +
              `📌 *Tipo:* ${cardData.type}\n` +
              `📌 *Saldo:* R$ ${cardData.balance.toFixed(2)}` +
              (cardData.reloadDay ? `\n📌 *Recarga:* Todo dia ${cardData.reloadDay}` : '') +
              `\n\nAgora você pode registrar gastos neste cartão! 😊`
            : `✅ ${userName}, atualizei seu cartão!\n\n` +
              `*💳 Novos Dados:*\n` +
              `📌 *Nome:* ${cardData.name}\n` +
              `📌 *Tipo:* ${cardData.type}\n` +
              `📌 *Saldo Atual:* R$ ${cardData.balance.toFixed(2)}` +
              (cardData.reloadDay ? `\n📌 *Recarga:* Todo dia ${cardData.reloadDay}` : '');

        await sock.sendMessage(sender, { text: successMessage });
        
        // Se for um cartão novo, enviar dicas de uso
        if (result === 'created') {
            setTimeout(async () => {
                await sock.sendMessage(sender, { 
                    text: `💡 *Dicas para usar seu cartão:*\n\n` +
                          `1️⃣ Registre gastos mencionando o cartão:\n` +
                          `   "Gastei 50 reais no ${cardData.name}"\n\n` +
                          `2️⃣ Consulte o saldo a qualquer momento:\n` +
                          `   "Qual o saldo do ${cardData.name}?"\n\n` +
                          `3️⃣ Atualize o saldo quando quiser:\n` +
                          `   "Cartão ${cardData.name} agora tem X reais"`
                });
            }, 1000);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao processar cartão:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao processar o cartão. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function checkCardBalance(sock, sender, cardName) {
    try {
        const userName = activationController.getUserName(sender);
        const cards = fileManager.loadCards(sender);
        
        if (!cards || cards.length === 0) {
            await sock.sendMessage(sender, { 
                text: `${userName}, você ainda não tem nenhum cartão cadastrado.\n\n` +
                      `Para cadastrar um cartão, me diga algo como:\n` +
                      `"Meu cartão nubank tem 500 reais"` 
            });
            return false;
        }

        if (cardName) {
            // Procurar cartão específico
            const card = cards.find(c => 
                c.name.toLowerCase().includes(cardName.toLowerCase())
            );

            if (card) {
                await sock.sendMessage(sender, { 
                    text: `💳 *Cartão ${card.name}*\n\n` +
                          `📌 *Tipo:* ${card.type}\n` +
                          `📌 *Saldo:* R$ ${card.balance.toFixed(2)}` +
                          (card.reloadDay ? `\n📌 *Recarga:* Todo dia ${card.reloadDay}` : '')
                });
            } else {
                await sock.sendMessage(sender, { 
                    text: `${userName}, não encontrei um cartão com esse nome.\n\n` +
                          `Seus cartões cadastrados são:\n` +
                          cards.map(c => `• ${c.name}`).join('\n')
                });
            }
        } else {
            // Mostrar todos os cartões
            let message = `💳 *Seus Cartões Cadastrados:*\n\n`;
            cards.forEach(card => {
                message += `*${card.name}*\n` +
                          `📌 *Tipo:* ${card.type}\n` +
                          `📌 *Saldo:* R$ ${card.balance.toFixed(2)}` +
                          (card.reloadDay ? `\n📌 *Recarga:* Todo dia ${card.reloadDay}` : '') +
                          `\n\n`;
            });
            
            await sock.sendMessage(sender, { text: message });
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao consultar saldo:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao consultar o saldo. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function deleteCard(sock, sender, cardName) {
    try {
        const userName = activationController.getUserName(sender);
        const cards = fileManager.loadCards(sender);
        
        if (!cards || cards.length === 0) {
            await sock.sendMessage(sender, { 
                text: `${userName}, você não tem nenhum cartão cadastrado.` 
            });
            return false;
        }

        const cardIndex = cards.findIndex(c => 
            c.name.toLowerCase() === cardName.toLowerCase()
        );

        if (cardIndex === -1) {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei um cartão com esse nome.\n\n` +
                      `Seus cartões cadastrados são:\n` +
                      cards.map(c => `• ${c.name}`).join('\n')
            });
            return false;
        }

        cards.splice(cardIndex, 1);
        fileManager.saveCards(sender, cards);

        await sock.sendMessage(sender, { 
            text: `✅ ${userName}, o cartão ${cardName} foi removido com sucesso!` 
        });
        
        return true;
    } catch (error) {
        console.error('Erro ao remover cartão:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao remover o cartão. Por favor, tente novamente.' 
        });
        return false;
    }
}

module.exports = {
    processCardManagement,
    checkCardBalance,
    deleteCard
};