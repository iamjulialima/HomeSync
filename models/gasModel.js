const db = require('../database/db');

const salvarLeitura = (valor, status, data_hora, callback) => {
  const sql = 'INSERT INTO gas (valor, status, dataHora) VALUES (?, ?, ?)';

  db.run(sql, [valor, status, data_hora], function(err) {
    if (err) {
      console.error('Erro ao salvar leitura do gás:', err.message);
      return callback(err);
    }
    callback(null);
  });
};

const listarLeituras = (callback) => {
  const query = 'SELECT * FROM gas ORDER BY dataHora DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar leituras do gás:', err.message);
      return callback(err, null);
    }
    callback(null, rows);
  });
};

module.exports = {
  salvarLeitura,
  listarLeituras,
};
