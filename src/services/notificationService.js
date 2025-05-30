const activationController = require('../controllers/activationController');

/**
 * Envia uma notificação sobre conta a pagar
 * @param {object} sock Objeto de conexão do WhatsApp
 * @param {object} notification Dados da notificação
 */
const sendBillReminder = async (sock, notification) => {
  try {
    const userName = activationController.getUserName(notification.userId);
    
    const message = `*⏰ Lembrete: Conta a Pagar Hoje*\n\n` +
                   `Olá ${userName}! Você tem uma conta vencendo hoje:\n\n` +
                   `*${notification.description}*\n` +
                   (notification.amount > 0 ? `Valor: R$ ${notification.amount.toFixed(2)}\n` : '') +
                   `\nResponda com "paguei ${notification.description}" para marcar como paga.`;
    
    await sock.sendMessage(notification.userId, { text: message });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar lembrete de conta:', error);
    return false;
  }
};

/**
 * Envia insights financeiros para o usuário
 * @param {object} sock Objeto de conexão do WhatsApp
 * @param {object} insight Dados do insight
 */
const sendInsight = async (sock, insight) => {
  try {
    const userName = activationController.getUserName(insight.userId);
    
    let message = `*💡 Insights Financeiros*\n\nOlá ${userName}! `;
    
    // Adiciona o insight específico
    switch (insight.type) {
      case 'category_increase':
        message += `Seus gastos com *${insight.category}* aumentaram ${insight.percentage}% comparado com o mês anterior.`;
        break;
        
      case 'expense_pattern':
        message += `Identificamos um padrão de gastos em *${insight.category}* nos últimos dias. Considere estabelecer um limite para esta categoria.`;
        break;
        
      case 'saving_opportunity':
        message += `Se você reduzir seus gastos em *${insight.category}* em ${insight.percentage}%, poderia economizar cerca de R$ ${insight.amount.toFixed(2)} por mês!`;
        break;
        
      case 'monthly_summary':
        message += `Seu total de gastos este mês foi de R$ ${insight.totalAmount.toFixed(2)}, sendo que *${insight.topCategory}* representou ${insight.topPercentage}% deste valor.`;
        break;
        
      default:
        message += insight.message || 'Aqui está um insight personalizado sobre suas finanças.';
    }
    
    if (insight.tip) {
      message += `\n\n*Dica:* ${insight.tip}`;
    }
    
    await sock.sendMessage(insight.userId, { text: message });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar insight:', error);
    return false;
  }
};

module.exports = {
  sendBillReminder,
  sendInsight
};