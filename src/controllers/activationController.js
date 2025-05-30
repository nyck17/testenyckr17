const fileManager = require('../utils/fileManager');
const { ADMIN_KEY } = require('../config/categories');
const { generateActivationKey } = require('../utils/parser');

// Verificar se o usuário está ativado
const isUserActivated = (userId) => {
  const users = fileManager.loadUsers();
  return users[userId] && users[userId].isActive;
};

// Processar a mensagem de ativação
const processActivation = async (sock, userId, message) => {
  const users = fileManager.loadUsers();
  
  // Se o usuário não existe, crie um novo registro
  if (!users[userId]) {
    users[userId] = {
      isActive: false,
      activationPending: true,
      userNumber: userId,
      createdAt: new Date().toISOString()
    };
    fileManager.saveUsers(users);
    
    await sock.sendMessage(userId, { 
      text: '*🤖 Olá! Sou seu assistente financeiro!*\n\nPara começar, preciso saber seu nome. Como posso chamá-lo?' 
    });
    return true;
  }
  
  // Se estamos esperando o nome do usuário
  if (users[userId].activationPending && !users[userId].name) {
    users[userId].name = message.trim();
    fileManager.saveUsers(users);
    
    await sock.sendMessage(userId, { 
      text: `*Olá, ${users[userId].name}!* 🎉\n\nPara ativar o bot, preciso de uma chave de ativação válida. Por favor, digite sua chave.` 
    });
    return true;
  }
  
  // Se estamos esperando a chave de ativação
  if (users[userId].activationPending && users[userId].name) {
    const providedKey = message.trim();
    
    // Verificar se é a chave administrativa
    if (providedKey === ADMIN_KEY) {
      const adminUsers = Object.values(users).filter(u => u.activationType === 'admin').length;
      
      if (adminUsers < 5) {
        users[userId].isActive = true;
        users[userId].activationPending = false;
        users[userId].activatedAt = new Date().toISOString();
        users[userId].activationType = 'admin';
        fileManager.saveUsers(users);
        
        await sock.sendMessage(userId, { 
          text: `*✅ Ativação concluída com sucesso!*\n\nOlá administrador ${users[userId].name}, seu assistente financeiro está pronto para uso! Para registrar gastos, basta enviar mensagens como:\n\n"Gastei 50 reais no supermercado"\n\nDigite "ajuda" para ver mais comandos.` 
        });
      } else {
        await sock.sendMessage(userId, { 
          text: `*❌ Chave administrativa já atingiu o limite*\n\nA chave administrativa já foi usada para ativar 5 números. Para adquirir uma nova chave, envie "comprar".` 
        });
      }
      return true;
    }
    
    // Verificar se a chave é válida
    if (providedKey.length >= 6) {
      users[userId].isActive = true;
      users[userId].activationPending = false;
      users[userId].activatedAt = new Date().toISOString();
      users[userId].activationType = 'regular';
      users[userId].activationKey = providedKey;
      fileManager.saveUsers(users);
      
      await sock.sendMessage(userId, { 
        text: `*✅ Ativação concluída com sucesso!*\n\nOlá ${users[userId].name}, seu assistente financeiro está pronto para uso! Para registrar gastos, basta enviar mensagens como:\n\n"Gastei 50 reais no supermercado"\n\nDigite "ajuda" para ver mais comandos.` 
      });
    } else {
      await sock.sendMessage(userId, { 
        text: `*❌ Chave inválida*\n\nA chave fornecida não é válida. Para adquirir uma chave, envie "comprar" ou tente novamente.` 
      });
    }
    return true;
  }
  
  return false;
};

// Processar pedido de compra
const processPurchaseRequest = async (sock, userId) => {
  // Gera uma chave de demonstração
  const dummyKey = generateActivationKey();
  
  await sock.sendMessage(userId, { 
    text: `*💰 Comprar Chave de Ativação*\n\nValor: R$ 29,90\n\nPara adquirir sua chave, faça um PIX para:\nChave: exemplo@email.com\nNome: Sistema Financeiro\n\nApós o pagamento, envie o comprovante aqui e lhe enviaremos sua chave de ativação.\n\n*Chave para demonstração:* ${dummyKey}` 
  });
  return true;
};

// Obter o nome do usuário
const getUserName = (userId) => {
  const users = fileManager.loadUsers();
  return users[userId]?.name || "usuário";
};

module.exports = {
  isUserActivated,
  processActivation,
  processPurchaseRequest,
  getUserName
};