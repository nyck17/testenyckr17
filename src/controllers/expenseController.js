const fileManager = require('../utils/fileManager');
const parser = require('../utils/parser');
const activationController = require('./activationController');

async function processExpenseRecord(sock, sender, message) {
    try {
        // Extrair dados da despesa
        const expenseData = parser.extractExpenseData(message);
        const userName = activationController.getUserName(sender);

        if (!expenseData || expenseData.amount <= 0) {
            await sock.sendMessage(sender, { 
                text: `${userName}, não consegui identificar o valor do gasto. Tente algo como:\n\n` +
                      `✓ "Gastei 50 reais no mercado"\n` +
                      `✓ "Paguei 30 no uber"\n` +
                      `✓ "Comprei um lanche por 25 reais"\n` +
                      `✓ "Conta de luz 150 reais"`
            });
            return false;
        }

        // Salvar a transação
        const transactionId = fileManager.saveTransaction(sender, expenseData);

        // Mensagem de confirmação personalizada
        let confirmationMessage = `✅ ${userName}, registrei seu gasto!\n\n` +
                                `*💰 Detalhes:*\n` +
                                `📌 *Valor:* R$ ${expenseData.amount.toFixed(2)}\n` +
                                `📌 *Categoria:* ${expenseData.category}\n` +
                                `📌 *Tipo:* ${expenseData.subcategory}\n` +
                                `📌 *Data:* ${new Date(expenseData.date).toLocaleDateString('pt-BR')}\n`;

        if (expenseData.description && expenseData.description !== 'Gasto geral') {
            confirmationMessage += `📌 *Descrição:* ${expenseData.description}\n`;
        }

        await sock.sendMessage(sender, { text: confirmationMessage });

        // Verificar se o gasto é significativo
        const monthlyReport = fileManager.getUserReport(sender, 'month');
        if (monthlyReport && monthlyReport.transactions.length > 5) {
            const avgExpense = monthlyReport.total / monthlyReport.transactions.length;
            
            if (expenseData.amount > avgExpense * 1.5) {
                setTimeout(async () => {
                    await sock.sendMessage(sender, { 
                        text: `💡 *Dica financeira*\n\n` +
                              `${userName}, esse gasto de R$ ${expenseData.amount.toFixed(2)} em ${expenseData.subcategory} ` +
                              `está ${Math.round((expenseData.amount / avgExpense - 1) * 100)}% acima da sua média mensal.\n\n` +
                              `Que tal estabelecer um limite para essa categoria? 😉`
                    });
                }, 1000);
            }
        }

        // Se for o primeiro gasto do dia, mostrar resumo
        const todayReport = fileManager.getUserReport(sender, 'day');
        if (todayReport.transactions.length === 1) {
            setTimeout(async () => {
                await sock.sendMessage(sender, { 
                    text: `📊 *Resumo do Dia*\n\n` +
                          `${userName}, este foi seu primeiro gasto hoje!\n` +
                          `Digite "relatório de hoje" para ver mais detalhes.`
                });
            }, 2000);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao processar gasto:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao registrar seu gasto. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function deleteExpense(sock, sender, transactionId) {
    try {
        const userName = activationController.getUserName(sender);
        const success = fileManager.deleteTransaction(sender, transactionId);

        if (success) {
            await sock.sendMessage(sender, { 
                text: `✅ ${userName}, o gasto foi removido com sucesso!` 
            });
            return true;
        } else {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei esse gasto no registro.` 
            });
            return false;
        }
    } catch (error) {
        console.error('Erro ao remover gasto:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao remover o gasto. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function editExpense(sock, sender, transactionId, updatedData) {
    try {
        const userName = activationController.getUserName(sender);
        const success = fileManager.updateTransaction(sender, transactionId, updatedData);

        if (success) {
            await sock.sendMessage(sender, { 
                text: `✅ ${userName}, o gasto foi atualizado com sucesso!\n\n` +
                      `*Novos dados:*\n` +
                      `📌 *Valor:* R$ ${updatedData.amount.toFixed(2)}\n` +
                      `📌 *Categoria:* ${updatedData.category}\n` +
                      `📌 *Tipo:* ${updatedData.subcategory}`
            });
            return true;
        } else {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei esse gasto no registro.` 
            });
            return false;
        }
    } catch (error) {
        console.error('Erro ao editar gasto:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao editar o gasto. Por favor, tente novamente.' 
        });
        return false;
    }
}

module.exports = {
    processExpenseRecord,
    deleteExpense,
    editExpense
};