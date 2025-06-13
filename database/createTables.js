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

// Criação da tabela estados da luz
db.run(`CREATE TABLE IF NOT EXISTS luzesStatus(
  cod_luz  INTEGER PRIMARY KEY,
  estado TEXT NOT NULL,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  intensidade TEXT NOT NULL
  )`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela luzesStatus:', err.message);
  } else {
    console.log('Tabela luzesStatus verificada/criada com sucesso.');
  }
});

// Criação tabela de agendamentos de luz
db.run(`CREATE TABLE IF NOT EXISTS agendamentoLuzes(
  cod_agendamento INTEGER PRIMARY KEY AUTOINCREMENT,
  acao TEXT NOT NULL,
  luzes TEXT  NOT NULL,
  data TEXT NOT NULL,
  hora TEXT NOT NULL,
  repetir TEXT NOT NULL,
  intensidade TEXT NOT NULL
  )`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela luzesStatus:', err.message);
  } else {
    console.log('Tabela luzesStatus verificada/criada com sucesso.');
  }
});

// Criação tabela portao
db.run(`CREATE TABLE IF NOT EXISTS portao (
  cod_portao INTEGER PRIMARY KEY AUTOINCREMENT,
  cod_usuario INTEGER NOT NULL,
  comando TEXT NOT NULL,
  dataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario)
)`, (err) => {
  if (err){
    console.error('Erro ao criar tabela portao:', err.message);
  } else {
    console.log('Tabela portao verificada/criada com sucesso.');
  }
});