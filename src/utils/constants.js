// Constantes do sistema
module.exports = {
    // Configurações do bot
    BOT_NAME: "Assistente Financeiro",
    BOT_VERSION: "1.0.0",
    
    // Configurações de intervalos (em milissegundos)
    CHECK_BILLS_INTERVAL: 3600000, // 1 hora
    BACKUP_INTERVAL: 86400000,     // 24 horas
    INSIGHTS_INTERVAL: 604800000,  // 1 semana
    
    // Mensagens
    WELCOME_MESSAGE: "*🤖 Olá! Sou seu assistente financeiro!*\n\nPara começar, preciso saber seu nome. Como posso chamá-lo?",
    UNKNOWN_COMMAND_MESSAGE: "*❓ Não entendi completamente sua solicitação.*\n\nVocê pode:\n- Registrar gastos: \"Gastei X reais em Y\"\n- Ver relatórios: \"Mostrar gastos do mês\"\n- Verificar status: \"Status\"\n\nDigite \"ajuda\" para ver todos os comandos disponíveis.",
    
    // Limites 
    ADMIN_ACTIVATIONS_LIMIT: 5,
    MINIMUM_KEY_LENGTH: 6,
    MAX_TRANSACTIONS_DISPLAY: 5
  };