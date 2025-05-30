const fileManager = require('../utils/fileManager');
const parser = require('../utils/parser');
const activationController = require('./activationController');

async function processBillRecord(sock, sender, message) {
    try {
        const billData = parser.extractBillData(message);
        const userName = activationController.getUserName(sender);

        if (!billData) {
            await sock.sendMessage(sender, { 
                text: `${userName}, não consegui identificar os detalhes da conta. Tente algo como:\n\n` +
                      `✓ "Tenho uma conta de luz de 150 reais para pagar dia 10"\n` +
                      `✓ "Conta de internet vence dia 15"\n` +
                      `✓ "Aluguel 1000 reais todo dia 5"\n` +
                      `✓ "Lembrar de pagar o cartão dia 12"`
            });
            return false;
        }

        // Salvar a conta
        const billId = fileManager.saveBill(sender, billData);

        // Formatar a data de vencimento
        const dueDate = new Date(billData.dueDate).toLocaleDateString('pt-BR');

        // Mensagem de confirmação
        let confirmationMessage = `✅ ${userName}, registrei sua conta!\n\n` +
                                `*📝 Detalhes:*\n` +
                                `📌 *Descrição:* ${billData.description}\n` +
                                `📌 *Vencimento:* ${dueDate}`;

        if (billData.amount > 0) {
            confirmationMessage += `\n📌 *Valor:* R$ ${billData.amount.toFixed(2)}`;
        }

        confirmationMessage += `\n\nVou te lembrar quando estiver próximo do vencimento! 😊`;

        await sock.sendMessage(sender, { text: confirmationMessage });

        // Se for a primeira conta do mês, mostrar dica
        const monthlyBills = fileManager.loadBills(sender).filter(b => 
            new Date(b.dueDate).getMonth() === new Date().getMonth()
        );

        if (monthlyBills.length === 1) {
            setTimeout(async () => {
                await sock.sendMessage(sender, { 
                    text: `💡 *Dica de organização*\n\n` +
                          `${userName}, que tal cadastrar todas as suas contas fixas? ` +
                          `Assim posso te ajudar a não esquecer nenhum pagamento!\n\n` +
                          `Você pode ver todas as suas contas cadastradas digitando "contas" ou "contas a pagar".`
                });
            }, 1000);
        }

        return true;
    } catch (error) {
        console.error('Erro ao processar conta:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao registrar a conta. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function processBillPayment(sock, sender, message) {
    try {
        const userName = activationController.getUserName(sender);
        const bills = fileManager.loadBills(sender);
        let billUpdated = false;
        
        // Extrair descrição da conta da mensagem
        const description = message.toLowerCase()
            .replace('paguei', '')
            .replace('conta', '')
            .replace('de', '')
            .trim();

        // Procurar a conta correspondente
        for (let i = 0; i < bills.length; i++) {
            if (!bills[i].isPaid && 
                bills[i].description.toLowerCase().includes(description)) {
                
                bills[i].isPaid = true;
                bills[i].paidAt = new Date().toISOString();
                billUpdated = true;

                // Registrar como transação
                const transaction = {
                    amount: bills[i].amount || 0,
                    category: 'moradia',
                    subcategory: bills[i].description.toLowerCase().includes('internet') ? 'internet' : 'condomínio',
                    description: `Pagamento: ${bills[i].description}`,
                    date: new Date().toISOString()
                };

                if (transaction.amount > 0) {
                    fileManager.saveTransaction(sender, transaction);
                }

                break;
            }
        }

        if (billUpdated) {
            fileManager.updateBills(sender, bills);
            
            await sock.sendMessage(sender, { 
                text: `✅ ${userName}, marquei a conta como paga!\n\n` +
                      `Registrei o pagamento e você não receberá mais lembretes sobre esta conta.`
            });

            // Mostrar próximas contas pendentes
            const pendingBills = bills.filter(b => !b.isPaid)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            if (pendingBills.length > 0) {
                setTimeout(async () => {
                    let message = `📝 *Próximas contas a vencer:*\n\n`;
                    pendingBills.slice(0, 3).forEach(bill => {
                        const dueDate = new Date(bill.dueDate).toLocaleDateString('pt-BR');
                        message += `• ${dueDate}: ${bill.description}`;
                        if (bill.amount > 0) message += ` - R$ ${bill.amount.toFixed(2)}`;
                        message += '\n';
                    });
                    
                    await sock.sendMessage(sender, { text: message });
                }, 1000);
            }
        } else {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei uma conta pendente com essa descrição.\n\n` +
                      `Digite "contas" para ver suas contas pendentes.`
            });
        }

        return billUpdated;
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao registrar o pagamento. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function checkDueBills(userId) {
    try {
        const bills = fileManager.loadBills(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filtrar contas que vencem hoje ou nos próximos 3 dias
        return bills.filter(bill => {
            if (bill.isPaid) return false;

            const dueDate = new Date(bill.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 3;
        });
    } catch (error) {
        console.error('Erro ao verificar contas:', error);
        return [];
    }
}

async function showBillsList(sock, sender) {
    try {
        const userName = activationController.getUserName(sender);
        const bills = fileManager.loadBills(sender);

        if (!bills || bills.length === 0) {
            await sock.sendMessage(sender, { 
                text: `${userName}, você não tem nenhuma conta cadastrada ainda.\n\n` +
                      `Para cadastrar uma conta, me diga algo como:\n` +
                      `"Tenho uma conta de luz para pagar dia 10"`
            });
            return true;
        }

        // Separar contas pagas e pendentes
        const pendingBills = bills.filter(b => !b.isPaid)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        const paidBills = bills.filter(b => b.isPaid)
            .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

        // Montar mensagem
        let message = `📝 *Suas Contas - ${userName}*\n\n`;

        if (pendingBills.length > 0) {
            message += `*Contas Pendentes:*\n`;
            pendingBills.forEach(bill => {
                const dueDate = new Date(bill.dueDate).toLocaleDateString('pt-BR');
                message += `• ${dueDate}: ${bill.description}`;
                if (bill.amount > 0) message += ` - R$ ${bill.amount.toFixed(2)}`;
                message += '\n';
            });
        } else {
            message += `*Não há contas pendentes! 🎉*\n`;
        }

        if (paidBills.length > 0) {
            message += `\n*Últimas Contas Pagas:*\n`;
            paidBills.slice(0, 3).forEach(bill => {
                const paidDate = new Date(bill.paidAt).toLocaleDateString('pt-BR');
                message += `✅ ${paidDate}: ${bill.description}`;
                if (bill.amount > 0) message += ` - R$ ${bill.amount.toFixed(2)}`;
                message += '\n';
            });
        }

        await sock.sendMessage(sender, { text: message });

        // Se houver muitas contas pendentes, enviar dica
        if (pendingBills.length > 5) {
            setTimeout(async () => {
                await sock.sendMessage(sender, { 
                    text: `💡 *Dica de organização*\n\n` +
                          `${userName}, você tem ${pendingBills.length} contas pendentes. ` +
                          `Que tal criar um planejamento mensal para seus pagamentos? ` +
                          `Posso te ajudar a organizar melhor suas contas!`
                });
            }, 1000);
        }

        return true;
    } catch (error) {
        console.error('Erro ao listar contas:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao listar suas contas. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function deleteBill(sock, sender, billId) {
    try {
        const userName = activationController.getUserName(sender);
        const success = fileManager.deleteBill(sender, billId);

        if (success) {
            await sock.sendMessage(sender, { 
                text: `✅ ${userName}, a conta foi removida com sucesso!` 
            });
            return true;
        } else {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei essa conta no registro.` 
            });
            return false;
        }
    } catch (error) {
        console.error('Erro ao remover conta:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao remover a conta. Por favor, tente novamente.' 
        });
        return false;
    }
}

module.exports = {
    processBillRecord,
    processBillPayment,
    checkDueBills,
    showBillsList,
    deleteBill
};