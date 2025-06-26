const db = require('../database/db');

const getTodasLuzes = (callback) => {
  const query = 'SELECT * FROM luzesStatus';
  db.all(query, [], (err, rows) => {
    callback(err, rows);
  });
};

const atualizarLuz = (id, estado, intensidade, callback) => {
  const sql = `UPDATE luzesStatus SET estado = ?, intensidade = ? WHERE cod_luz = ?`;

  db.run(sql, [estado, intensidade, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar luz:', err.message);
      return callback(err);
    }
    callback(null);
  });
}

const criarLuz = (cod, nome, localizacao, intensidade, estado, callback) => {
  const sql = `INSERT INTO luzesStatus (cod_luz, estado, nome, localizacao, intensidade)
               VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [cod, estado, nome, localizacao, intensidade], function(err) {
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
  getTodasLuzes,
  atualizarLuz,
  criarLuz,
  removerLuz,
  getLuzPorId, 
  editarIdentidadeLuz,
};