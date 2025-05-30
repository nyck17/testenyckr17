const fileManager = require('../utils/fileManager');
const parser = require('../utils/parser');
const activationController = require('./activationController');

async function processReportRequest(sock, sender, message) {
    try {
        const userName = activationController.getUserName(sender);
        const period = parser.extractReportPeriod(message);
        const report = fileManager.getUserReport(sender, period);

        // Se não houver transações
        if (!report || report.transactions.length === 0) {
            await sock.sendMessage(sender, { 
                text: `${userName}, não encontrei gastos registrados para este período. 📊\n\n` +
                      `Para começar a registrar seus gastos, basta me dizer algo como:\n` +
                      `"Gastei 50 reais no mercado"`
            });
            return true;
        }

        // Gerar mensagem do relatório
        let reportMessage = `📊 *Relatório de Gastos - ${getPeriodText(period)}*\n\n`;
        
        // Total gasto
        reportMessage += `💰 *Total gasto:* R$ ${report.total.toFixed(2)}\n\n`;

        // Top 3 categorias
        reportMessage += `*📌 Principais categorias:*\n`;
        const sortedCategories = Object.entries(report.categorySummary)
            .sort((a, b) => b[1].total - a[1].total);

        for (let i = 0; i < Math.min(3, sortedCategories.length); i++) {
            const [category, data] = sortedCategories[i];
            const percentage = (data.total / report.total * 100).toFixed(1);
            reportMessage += `${i + 1}. ${category}: R$ ${data.total.toFixed(2)} (${percentage}%)\n`;
        }

        // Últimas transações
        reportMessage += `\n*📝 Últimas transações:*\n`;
        const recentTransactions = [...report.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        recentTransactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('pt-BR');
            reportMessage += `• ${date}: ${t.description || t.subcategory} - R$ ${t.amount.toFixed(2)}\n`;
        });

        // Enviar relatório
        await sock.sendMessage(sender, { text: reportMessage });

        // Enviar insights após um breve delay
        setTimeout(async () => {
            const insights = generateInsights(report, period);
            if (insights) {
                await sock.sendMessage(sender, { text: insights });
            }
        }, 1000);

        // Se for relatório mensal, enviar dicas de economia
        if (period === 'month' && report.transactions.length >= 5) {
            setTimeout(async () => {
                const tips = generateFinancialTips(report);
                if (tips) {
                    await sock.sendMessage(sender, { text: tips });
                }
            }, 2000);
        }

        return true;
    } catch (error) {
        console.error('Erro ao processar relatório:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao gerar o relatório. Por favor, tente novamente.' 
        });
        return false;
    }
}

async function processStatusRequest(sock, sender) {
    try {
        const userName = activationController.getUserName(sender);
        
        // Obter relatório do mês atual
        const monthlyReport = fileManager.getUserReport(sender, 'month');
        
        // Obter cartões do usuário
        const cards = fileManager.loadCards(sender);
        
        // Obter contas a pagar
        const bills = fileManager.loadBills(sender);
        const unpaidBills = bills.filter(bill => !bill.isPaid);
        
        // Montar mensagem de status
        let statusMsg = `*📊 Status da Conta - ${userName}*\n\n`;
        
        // Total gasto no mês
        statusMsg += `💰 *Gasto total no mês:* R$ ${monthlyReport ? monthlyReport.total.toFixed(2) : '0.00'}\n\n`;
        
        // Cartões
        statusMsg += `*💳 Seus Cartões:*\n`;
        if (cards.length > 0) {
            cards.forEach(card => {
                statusMsg += `• ${card.name}: R$ ${card.balance.toFixed(2)}`;
                if (card.reloadDay) {
                    statusMsg += ` (recarga dia ${card.reloadDay})`;
                }
                statusMsg += '\n';
            });
        } else {
            statusMsg += `Nenhum cartão cadastrado ainda.\n`;
        }
        statusMsg += '\n';
        
        // Contas a pagar
        statusMsg += `*📝 Próximas Contas:*\n`;
        if (unpaidBills.length > 0) {
            unpaidBills
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 3)
                .forEach(bill => {
                    const dueDate = new Date(bill.dueDate).toLocaleDateString('pt-BR');
                    statusMsg += `• ${dueDate}: ${bill.description}`;
                    if (bill.amount > 0) statusMsg += ` - R$ ${bill.amount.toFixed(2)}`;
                    statusMsg += '\n';
                });
        } else {
            statusMsg += `Nenhuma conta pendente.\n`;
        }
        
        await sock.sendMessage(sender, { text: statusMsg });

        // Se houver gastos, enviar análise rápida
        if (monthlyReport && monthlyReport.transactions.length > 0) {
            setTimeout(async () => {
                const quickAnalysis = generateQuickAnalysis(monthlyReport);
                await sock.sendMessage(sender, { text: quickAnalysis });
            }, 1000);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao processar status:', error);
        await sock.sendMessage(sender, { 
            text: 'Desculpe, ocorreu um erro ao gerar seu status. Por favor, tente novamente.' 
        });
        return false;
    }
}

// Funções auxiliares
function getPeriodText(period) {
    switch (period) {
        case 'day':
            return 'Hoje';
        case 'week':
            return 'Esta Semana';
        case 'month':
            return 'Este Mês';
        default:
            return 'Período';
    }
}

function generateInsights(report, period) {
    if (!report || report.transactions.length === 0) return null;

    let insights = `💡 *Análise dos seus gastos:*\n\n`;

    // Categoria com maior gasto
    const topCategory = Object.entries(report.categorySummary)
        .sort((a, b) => b[1].total - a[1].total)[0];
    
    insights += `• Sua maior despesa foi com *${topCategory[0]}*: ` +
                `R$ ${topCategory[1].total.toFixed(2)} ` +
                `(${((topCategory[1].total / report.total) * 100).toFixed(1)}% do total)\n`;

    // Média diária
    const avgDaily = report.total / getDaysInPeriod(period);
    insights += `• Média diária de gastos: R$ ${avgDaily.toFixed(2)}\n`;

    // Dia com mais gastos
    const dailyTotals = {};
    report.transactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('pt-BR');
        dailyTotals[date] = (dailyTotals[date] || 0) + t.amount;
    });

    const topDay = Object.entries(dailyTotals)
        .sort((a, b) => b[1] - a[1])[0];
    
    insights += `• Dia com mais gastos: ${topDay[0]} (R$ ${topDay[1].toFixed(2)})\n`;

    return insights;
}

function generateFinancialTips(report) {
    if (!report || report.transactions.length === 0) return null;

    let tips = `💡 *Dicas de economia baseadas nos seus gastos:*\n\n`;

    // Analisar padrões de gasto
    const sortedCategories = Object.entries(report.categorySummary)
        .sort((a, b) => b[1].total - a[1].total);

    // Dica baseada na maior categoria
    const [topCategory, topData] = sortedCategories[0];
    const topPercentage = (topData.total / report.total * 100).toFixed(1);

    if (topPercentage > 40) {
        tips += `• Seus gastos com *${topCategory}* representam ${topPercentage}% do total. ` +
                `Que tal estabelecer um limite mensal para esta categoria?\n\n`;
    }

    // Dicas gerais baseadas nas categorias
    if (report.categorySummary['alimentação']?.total > 0) {
        tips += `• Para economizar em alimentação, considere fazer uma lista de compras e evitar ir ao mercado com fome 🛒\n`;
    }

    if (report.categorySummary['transporte']?.total > 0) {
        tips += `• Procure alternativas de transporte mais econômicas ou compartilhe caronas 🚗\n`;
    }

    return tips;
}

function generateQuickAnalysis(report) {
    let analysis = `📊 *Análise Rápida*\n\n`;

    // Comparar com média histórica
    const avgTransaction = report.total / report.transactions.length;
    analysis += `• Média por transação: R$ ${avgTransaction.toFixed(2)}\n`;

    // Categoria mais frequente
    const categoryFrequency = {};
    report.transactions.forEach(t => {
        categoryFrequency[t.category] = (categoryFrequency[t.category] || 0) + 1;
    });

    const mostFrequentCategory = Object.entries(categoryFrequency)
        .sort((a, b) => b[1] - a[1])[0];

    analysis += `• Categoria mais frequente: ${mostFrequentCategory[0]}\n`;

    return analysis;
}

function getDaysInPeriod(period) {
    switch (period) {
        case 'day':
            return 1;
        case 'week':
            return 7;
        case 'month':
            return 30;
        default:
            return 30;
    }
}

module.exports = {
    processReportRequest,
    processStatusRequest
};