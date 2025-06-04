const db = require('./db');

// Criação da tabela de usuários
db.run(`CREATE TABLE IF NOT EXISTS usuario (
  cod_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela usuario:', err.message);
  } else {
    console.log('Tabela usuario verificada/criada com sucesso.');
  }
});

