const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'banco.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite');

    // Ativa as chaves estrangeiras
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Erro ao ativar chave estrangeira:', err.message);
      } else {
        console.log('Chaves estrangeiras ativadas.');
      }
    });
  }
});

module.exports = db;