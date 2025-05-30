// Formata o relatório como texto
function formatReportText(report, period) {
    if (!report || report.transactions.length === 0) {
      return `Não encontrei gastos para o período solicitado.`;
    }
    
    let periodText;
    switch (period) {
      case 'day':
        periodText = 'hoje';
        break;
      case 'week':
        periodText = 'esta semana';
        break;
      case 'month':
      default:
        periodText = 'este mês';
        break;
    }
    
    let result = `*📊 Relatório de Gastos - ${periodText}*\n\n`;
    result += `💰 *Total gasto: R$ ${report.total.toFixed(2)}*\n\n`;
    
    // Top 3 categorias
    const sortedCategories = Object.entries(report.categorySummary)
      .sort((a, b) => b[1].total - a[1].total);
    
    result += `*📌 Principais categorias:*\n`;
    
    for (let i = 0; i < Math.min(3, sortedCategories.length); i++) {
      const [category, data] = sortedCategories[i];
      const percentage = (data.total / report.total * 100).toFixed(1);
      result += `   ${i+1}. ${category.charAt(0).toUpperCase() + category.slice(1)}: R$ ${data.total.toFixed(2)} (${percentage}%)\n`;
    }
    
    result += `\n*📝 Últimas transações:*\n`;
    
    // Mostra as 5 transações mais recentes
    const recentTransactions = [...report.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    recentTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('pt-BR');
      result += `   • ${date}: ${t.description || t.subcategory} - R$ ${t.amount.toFixed(2)}\n`;
    });
    
    return result;
  }
  
  // Gera um gráfico ASCII simples para categorias
  function generateSimpleChart(report) {
    if (!report || report.transactions.length === 0) {
      return "";
    }
    
    const sortedCategories = Object.entries(report.categorySummary)
      .sort((a, b) => b[1].total - a[1].total);
    
    let chart = "\n*Distribuição de Gastos:*\n";
    
    sortedCategories.forEach(([category, data]) => {
      const percentage = (data.total / report.total * 100).toFixed(1);
      const barLength = Math.round(percentage / 5);
      const bar = '█'.repeat(barLength);
      
      chart += `${category.substring(0, 10).padEnd(10)}: ${bar} ${percentage}%\n`;
    });
    
    return chart;
  }
  
  module.exports = {
    formatReportText,
    generateSimpleChart
  };