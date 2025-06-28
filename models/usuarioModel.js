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

const atualizarSenha = (email, novaSenha, callback) => {
  const query = 'UPDATE usuario SET senha = ? WHERE email = ?';
  db.run(query, [novaSenha, email], function (err) {
    callback(err);
  });
};

const atualizarUsuario = (id, novoNome, novoEmail, callback) => {
  const query = 'UPDATE usuario SET nome = ?, email = ? WHERE cod_usuario = ?';
  db.run(query, [novoNome, novoEmail, id], function (err) {
    callback(err);
  });
};

const atualizarSenhaPorId = (id, novaSenha, callback) => {
  const query = 'UPDATE usuario SET senha = ? WHERE cod_usuario = ?';
  db.run(query, [novaSenha, id], function (err) {
    callback(err);
  });
};

const buscarUsuarioPorId = (id, callback) => {
  const query = 'SELECT * FROM usuario WHERE cod_usuario = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
    }
    callback(err, row);
  });
};

const atualizarNomeEmail = (id, nome, email, callback) => {
  const query = 'UPDATE usuario SET nome = ?, email = ? WHERE cod_usuario = ?';
  db.run(query, [nome, email, id], function (err) {
    callback(err);
  });
};

const atualizarNome = (id, nome, callback) => {
  const query = 'UPDATE usuario SET nome = ? WHERE cod_usuario = ?';
  db.run(query, [nome, id], function (err) {
    callback(err);
  });
};

const atualizarEmail = (id, email, callback) => {
  const query = 'UPDATE usuario SET email = ? WHERE cod_usuario = ?';
  db.run(query, [email, id], function (err) {
    callback(err);
  });
};


module.exports = {
  criarUsuario,
  buscarUsuarioPorEmail,
  atualizarSenha,
  atualizarUsuario,
  atualizarSenhaPorId,
  buscarUsuarioPorId,
  atualizarNomeEmail,
  atualizarNome,
  atualizarEmail

};
