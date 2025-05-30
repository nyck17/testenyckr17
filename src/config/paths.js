const path = require('path');

// Diretórios para armazenamento de dados
const SESSIONS_DIR = path.join(__dirname, '../../sessions');
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRANSACTIONS_DIR = path.join(DATA_DIR, 'transactions');
const CARDS_DIR = path.join(DATA_DIR, 'cards');
const BILLS_DIR = path.join(DATA_DIR, 'bills');

// Certificar que diretórios existem
const ensureDirectories = () => {
  const fs = require('fs');
  [SESSIONS_DIR, DATA_DIR, TRANSACTIONS_DIR, CARDS_DIR, BILLS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Inicializar arquivos de dados se não existirem
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}));
};

module.exports = {
  SESSIONS_DIR,
  DATA_DIR,
  USERS_FILE,
  TRANSACTIONS_DIR,
  CARDS_DIR,
  BILLS_DIR,
  ensureDirectories
};