const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/paths');

/**
 * Cria um backup completo dos dados
 */
const createFullBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const backupDir = path.join(DATA_DIR, 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFileName = `backup_${timestamp}.zip`;
    const backupPath = path.join(backupDir, backupFileName);
    
    // Em uma implementação real, você usaria uma biblioteca como
    // arquiver ou zip-a-folder para compactar os dados
    console.log(`Criando backup em: ${backupPath}`);
    
    // Simulação básica: copia o arquivo de usuários para a pasta de backup
    const usersFile = path.join(DATA_DIR, 'users.json');
    if (fs.existsSync(usersFile)) {
      fs.copyFileSync(usersFile, path.join(backupDir, `users_${timestamp}.json`));
    }
    
    // Num sistema real, você incluiria todos os arquivos de dados
    
    console.log(`Backup concluído: ${backupFileName}`);
    return backupFileName;
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    return null;
  }
};

/**
 * Backup dos dados de um usuário específico
 * @param {string} userId ID do usuário
 */
const backupUserData = async (userId) => {
  try {
    const userBackupDir = path.join(DATA_DIR, 'backups', 'users', userId);
    
    if (!fs.existsSync(userBackupDir)) {
      fs.mkdirSync(userBackupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    
    // Copia os arquivos de transações, cartões e contas do usuário
    const filesToBackup = [
      { source: path.join(DATA_DIR, 'transactions', `${userId}.json`), 
        target: path.join(userBackupDir, `transactions_${timestamp}.json`) },
      { source: path.join(DATA_DIR, 'cards', `${userId}.json`), 
        target: path.join(userBackupDir, `cards_${timestamp}.json`) },
      { source: path.join(DATA_DIR, 'bills', `${userId}.json`), 
        target: path.join(userBackupDir, `bills_${timestamp}.json`) },
    ];
    
    for (const file of filesToBackup) {
      if (fs.existsSync(file.source)) {
        fs.copyFileSync(file.source, file.target);
      }
    }
    
    // Limitar o número de backups por usuário para economizar espaço
    const MAX_BACKUPS = 5;
    const files = fs.readdirSync(userBackupDir);
    
    if (files.length > MAX_BACKUPS * 3) { // 3 arquivos por backup
      // Ordena os arquivos por data (mais antigos primeiro)
      const sortedFiles = files.sort();
      
      // Remove os backups mais antigos
      const filesToRemove = sortedFiles.slice(0, 3); // Remove o backup mais antigo (3 arquivos)
      
      for (const file of filesToRemove) {
        fs.unlinkSync(path.join(userBackupDir, file));
      }
    }
    
    console.log(`Backup do usuário ${userId} concluído`);
    return true;
  } catch (error) {
    console.error(`Erro ao fazer backup do usuário ${userId}:`, error);
    return false;
  }
};

module.exports = {
  createFullBackup,
  backupUserData
};