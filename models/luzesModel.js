const db = require('../database/db');

const getTodasLuzes = (callback) => {
  const query = 'SELECT * FROM luzesStatus';
  db.all(query, [], (err, rows) => {
    callback(err, rows);
  });
};

function atualizarLuz(cod_luz, estado, intensidade, callback) {
  const sql = `UPDATE luzesStatus SET estado = ?, intensidade = ? WHERE cod_luz = ?`;
  db.run(sql, [estado, intensidade, cod_luz], function(err) {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = {
  getTodasLuzes,
  atualizarLuz
};