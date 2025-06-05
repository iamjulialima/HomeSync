const db = require('../database/db');

const getTodasLuzes = (callback) => {
  const query = 'SELECT * FROM luzesStatus';
  db.all(query, [], (err, rows) => {
    callback(err, rows);
  });
};

module.exports = {
  getTodasLuzes,
};