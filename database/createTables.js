const db = require('./db');

// Tabela de Usuários
db.run(`CREATE TABLE IF NOT EXISTS usuario (
  cod_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
)`, (err) => {
  if (err) console.error('Erro ao criar tabela usuario:', err.message);
  else console.log('Tabela usuario verificada/criada com sucesso.');
});


// Tabela de Luzes (podem ser compartilhadas)
db.run(`CREATE TABLE IF NOT EXISTS luzesStatus (
  cod_luz INTEGER PRIMARY KEY AUTOINCREMENT,
  estado TEXT NOT NULL,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  intensidade TEXT NOT NULL
)`, (err) => {
  if (err) console.error('Erro ao criar tabela luzesStatus:', err.message);
  else console.log('Tabela luzesStatus verificada/criada com sucesso.');
});

// Relacionamento usuário ↔ luz
db.run(`CREATE TABLE IF NOT EXISTS usuario_luzes (
  cod_usuario INTEGER NOT NULL,
  cod_luz INTEGER NOT NULL,
  PRIMARY KEY (cod_usuario, cod_luz),
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario),
  FOREIGN KEY (cod_luz) REFERENCES luzesStatus(cod_luz)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela usuario_luzes:', err.message);
  else console.log('Tabela usuario_luzes verificada/criada com sucesso.');
});


// Agendamento de Luz (quem agenda + luz)
db.run(`CREATE TABLE IF NOT EXISTS agendamentoLuzes (
  cod_agendamento INTEGER PRIMARY KEY AUTOINCREMENT,
  acao TEXT NOT NULL,
  luzes INTEGER NOT NULL,
  data TEXT NOT NULL,
  hora TEXT NOT NULL,
  repetir TEXT NOT NULL,
  intensidade TEXT NOT NULL,
  cod_usuario INTEGER NOT NULL,
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario),
  FOREIGN KEY (luzes) REFERENCES luzesStatus(cod_luz)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela agendamentoLuzes:', err.message);
  else console.log('Tabela agendamentoLuzes verificada/criada com sucesso.');
});


// Tabela de Portão 
db.run(`CREATE TABLE IF NOT EXISTS portao (
  cod_portao INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,  -- Ex: PRT001
  descricao TEXT
)`, (err) => {
  if (err) console.error('Erro ao criar tabela portao:', err.message);
  else console.log('Tabela portao verificada/criada com sucesso.');
});

// Relacionamento usuário ↔ portão
db.run(`CREATE TABLE IF NOT EXISTS usuario_portao (
  cod_usuario INTEGER NOT NULL,
  cod_portao INTEGER NOT NULL,
  PRIMARY KEY (cod_usuario, cod_portao),
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario),
  FOREIGN KEY (cod_portao) REFERENCES portao(cod_portao)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela usuario_portao:', err.message);
  else console.log('Tabela usuario_portao verificada/criada com sucesso.');
});


// Histórico de Ações do Portão
db.run(`CREATE TABLE IF NOT EXISTS historico_portao (
  cod_acao INTEGER PRIMARY KEY AUTOINCREMENT,
  cod_portao INTEGER NOT NULL,
  cod_usuario INTEGER NOT NULL,
  comando TEXT NOT NULL,
  dataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cod_portao) REFERENCES portao(cod_portao),
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela historico_portao:', err.message);
  else console.log('Tabela historico_portao verificada/criada com sucesso.');
});


// Sensor de Temperatura 
db.run(`CREATE TABLE IF NOT EXISTS sensor_temperatura (
  cod_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,   -- Ex: TMP001
  descricao TEXT
)`, (err) => {
  if (err) console.error('Erro ao criar tabela sensor_temperatura:', err.message);
  else console.log('Tabela sensor_temperatura verificada/criada com sucesso.');
});

// Relacionamento usuário ↔ sensor de temperatura
db.run(`CREATE TABLE IF NOT EXISTS usuario_sensor_temperatura (
  cod_usuario INTEGER NOT NULL,
  cod_sensor INTEGER NOT NULL,
  PRIMARY KEY (cod_usuario, cod_sensor),
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario),
  FOREIGN KEY (cod_sensor) REFERENCES sensor_temperatura(cod_sensor)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela usuario_sensor_temperatura:', err.message);
  else console.log('Tabela usuario_sensor_temperatura verificada/criada com sucesso.');
});


// Registros de temperatura
db.run(`CREATE TABLE IF NOT EXISTS temperatura (
  cod_temperatura INTEGER PRIMARY KEY AUTOINCREMENT,
  temperatura REAL NOT NULL,
  umidade REAL NOT NULL,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cod_sensor INTEGER NOT NULL,
  FOREIGN KEY (cod_sensor) REFERENCES sensor_temperatura(cod_sensor)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela temperatura:', err.message);
  else console.log('Tabela temperatura verificada/criada com sucesso.');
});


// Sensor de Gás 
db.run(`CREATE TABLE IF NOT EXISTS sensor_gas (
  cod_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,  -- Ex: GAS001
  descricao TEXT
)`, (err) => {
  if (err) console.error('Erro ao criar tabela sensor_gas:', err.message);
  else console.log('Tabela sensor_gas verificada/criada com sucesso.');
});

// Relacionamento usuário ↔ sensor de gás
db.run(`CREATE TABLE IF NOT EXISTS usuario_sensor_gas (
  cod_usuario INTEGER NOT NULL,
  cod_sensor INTEGER NOT NULL,
  PRIMARY KEY (cod_usuario, cod_sensor),
  FOREIGN KEY (cod_usuario) REFERENCES usuario(cod_usuario),
  FOREIGN KEY (cod_sensor) REFERENCES sensor_gas(cod_sensor)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela usuario_sensor_gas:', err.message);
  else console.log('Tabela usuario_sensor_gas verificada/criada com sucesso.');
});


// Registros de vazamento de gás
db.run(`CREATE TABLE IF NOT EXISTS gas (
  cod_gas INTEGER PRIMARY KEY AUTOINCREMENT,
  valor INTEGER NOT NULL,
  status TEXT NOT NULL,
  dataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cod_sensor INTEGER NOT NULL,
  FOREIGN KEY (cod_sensor) REFERENCES sensor_gas(cod_sensor)
)`, (err) => {
  if (err) console.error('Erro ao criar tabela gas:', err.message);
  else console.log('Tabela gas verificada/criada com sucesso.');
});
