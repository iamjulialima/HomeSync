// models/TemperaturaModel.js
const db = require('../database/db');

const TemperaturaModel = {
  salvar: (temperatura, umidade) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO temperatura (temperatura, umidade) VALUES (?, ?)`;
      db.run(sql, [temperatura, umidade], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  },

  listarUltimasPorPeriodo: (horas) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT temperatura, umidade, data_hora 
        FROM temperatura 
        WHERE data_hora >= datetime('now', ?)
        ORDER BY data_hora ASC
      `;
      db.all(sql, [`-${horas} hours`], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = TemperaturaModel;
