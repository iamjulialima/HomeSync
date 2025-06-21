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

module.exports = {
  getTodasLuzes,
  atualizarLuz,
};