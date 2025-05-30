const fs = require('fs');
const paths = require('../config/paths');

// Carregar usuários
const loadUsers = () => {
  try {
    const data = fs.readFileSync(paths.USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return {};
  }
};

// Salvar usuários
const saveUsers = (users) => {
  try {
    fs.writeFileSync(paths.USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
};

// Salvar uma transação para um usuário
const saveTransaction = (userId, transaction) => {
  const userTransactionsFile = paths.TRANSACTIONS_DIR + `/${userId}.json`;
  let transactions = [];
  
  try {
    if (fs.existsSync(userTransactionsFile)) {
      transactions = JSON.parse(fs.readFileSync(userTransactionsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar transações do usuário ${userId}:`, error);
  }
  
  transactions.push(transaction);
  fs.writeFileSync(userTransactionsFile, JSON.stringify(transactions, null, 2));
  
  return transactions.length;
};

// Salvar um cartão para um usuário
const saveCard = (userId, card) => {
  const userCardsFile = paths.CARDS_DIR + `/${userId}.json`;
  let cards = [];
  
  try {
    if (fs.existsSync(userCardsFile)) {
      cards = JSON.parse(fs.readFileSync(userCardsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar cartões do usuário ${userId}:`, error);
  }
  
  // Verifica se já existe um cartão com o mesmo nome
  const existingCardIndex = cards.findIndex(c => c.name.toLowerCase() === card.name.toLowerCase());
  
  if (existingCardIndex >= 0) {
    cards[existingCardIndex] = { ...cards[existingCardIndex], ...card };
  } else {
    cards.push(card);
  }
  
  fs.writeFileSync(userCardsFile, JSON.stringify(cards, null, 2));
  
  return existingCardIndex >= 0 ? 'updated' : 'created';
};

// Salvar uma conta a pagar para um usuário
const saveBill = (userId, bill) => {
  const userBillsFile = paths.BILLS_DIR + `/${userId}.json`;
  let bills = [];
  
  try {
    if (fs.existsSync(userBillsFile)) {
      bills = JSON.parse(fs.readFileSync(userBillsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar contas do usuário ${userId}:`, error);
  }
  
  bills.push(bill);
  fs.writeFileSync(userBillsFile, JSON.stringify(bills, null, 2));
  
  return bills.length;
};

// Carregar contas a pagar do usuário
const loadBills = (userId) => {
  const userBillsFile = paths.BILLS_DIR + `/${userId}.json`;
  let bills = [];
  
  try {
    if (fs.existsSync(userBillsFile)) {
      bills = JSON.parse(fs.readFileSync(userBillsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar contas do usuário ${userId}:`, error);
  }
  
  return bills;
};

// Carregar cartões do usuário
const loadCards = (userId) => {
  const userCardsFile = paths.CARDS_DIR + `/${userId}.json`;
  let cards = [];
  
  try {
    if (fs.existsSync(userCardsFile)) {
      cards = JSON.parse(fs.readFileSync(userCardsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar cartões do usuário ${userId}:`, error);
  }
  
  return cards;
};

// Carregar transações do usuário
const loadTransactions = (userId) => {
  const userTransactionsFile = paths.TRANSACTIONS_DIR + `/${userId}.json`;
  let transactions = [];
  
  try {
    if (fs.existsSync(userTransactionsFile)) {
      transactions = JSON.parse(fs.readFileSync(userTransactionsFile));
    }
  } catch (error) {
    console.error(`Erro ao carregar transações do usuário ${userId}:`, error);
  }
  
  return transactions;
};

// Atualizar contas do usuário
const updateBills = (userId, bills) => {
  const userBillsFile = paths.BILLS_DIR + `/${userId}.json`;
  
  try {
    fs.writeFileSync(userBillsFile, JSON.stringify(bills, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar contas do usuário ${userId}:`, error);
    return false;
  }
};

module.exports = {
  loadUsers,
  saveUsers,
  saveTransaction,
  saveCard,
  saveBill,
  loadBills,
  loadCards,
  loadTransactions,
  updateBills
};