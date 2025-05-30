const whatsappService = require('./services/whatsappService');

// Inicializar o bot do WhatsApp
async function initializeBot() {
  try {
    console.log('Iniciando o Bot Financeiro para WhatsApp...');
    await whatsappService.startWhatsAppBot();
  } catch (error) {
    console.error('Erro ao inicializar o bot:', error);
    process.exit(1);
  }
}

module.exports = { initializeBot };