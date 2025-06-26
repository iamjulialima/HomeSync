const db = require('../database/db');

// Buscar todas as luzes de um usuário específico
const getLuzesPorUsuario = (cod_usuario, callback) => {
  const sql = `
    SELECT l.*
    FROM luzesStatus l
    INNER JOIN usuario_luzes ul ON l.cod_luz = ul.cod_luz
    WHERE ul.cod_usuario = ?
  `;
  db.all(sql, [cod_usuario], (err, rows) => {
    callback(err, rows);
  });
};

const getLuzPorId = (cod_luz, callback) => {
  const sql = `SELECT * FROM luzesStatus WHERE cod_luz = ?`;
  db.get(sql, [cod_luz], (err, row) => {
    callback(err, row);
  });
};

// Atualizar estado/intensidade da luz
const atualizarLuz = (cod_luz, estado, intensidade, callback) => {
  const sql = `UPDATE luzesStatus SET estado = ?, intensidade = ? WHERE cod_luz = ?`;
  db.run(sql, [estado, intensidade, cod_luz], function(err) {
    if (err) {
      console.error('Erro ao atualizar luz:', err.message);
      return callback(err);
    }
    callback(null);
  });
};

// Criar nova luz e associar ao usuário
const criarLuz = (nome, localizacao, intensidade, estado, cod_usuario, callback) => {
  const sql = `INSERT INTO luzesStatus (estado, nome, localizacao, intensidade, cod_usuario)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [estado, nome, localizacao, intensidade, cod_usuario], function(err) {
    if (err) {
      console.error('Erro ao criar nova luz:', err.message);
      return callback(err);
    }
    const novaLuz = {
      cod,
      estado,
      nome,
      localizacao,
      intensidade
    };
    callback(null, novaLuz);
  });
};

const removerLuz = (id, callback) => {
  const sql = `DELETE FROM luzesStatus WHERE cod_luz = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Erro ao remover luz:', err.message);
      return callback(err);
    }
    callback(null);
  });
};

const getLuzPorId = (id, callback) => {
  const sql = 'SELECT * FROM luzesStatus WHERE cod_luz = ?';
  db.get(sql, [id], (err, row) => {
    callback(err, row);
  });
};

const editarIdentidadeLuz = (idOriginal, novoCod, nome, localizacao, callback) => {
  const sql = `UPDATE luzesStatus SET cod_luz = ?, nome = ?, localizacao = ? WHERE cod_luz = ?`;
  db.run(sql, [novoCod, nome, localizacao, idOriginal], function (err) {
    callback(err);
  });
};


module.exports = {
  getLuzesPorUsuario,
  criarLuz,
  getLuzPorId,
  atualizarLuz,
  removerLuz,
  getLuzPorId, 
  editarIdentidadeLuz,
};
