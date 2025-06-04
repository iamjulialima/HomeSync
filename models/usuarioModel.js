const db = require('../database/db');

const criarUsuario = (nome, email, senha, callback) => {
  console.log('Tentando criar usuário:', nome, email);
  const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
  db.run(query, [nome, email, senha], function (err) {
    if (err) {
      console.error('Erro ao inserir usuário:', err.message);
    } else {
      console.log('Usuário criado com id:', this.lastID);
    }
    callback(err, this?.lastID);
  });
};


const buscarUsuarioPorEmail = (email, callback) => {
  const query = 'SELECT * FROM usuario WHERE email = ?';
  db.get(query, [email], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  criarUsuario,
  buscarUsuarioPorEmail,
};