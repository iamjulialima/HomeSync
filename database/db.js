const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'banco.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite');
  }
});

// Criação da tabela
db.run(`CREATE TABLE IF NOT EXISTS usuario (
  cod_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
)`);

module.exports = db;
