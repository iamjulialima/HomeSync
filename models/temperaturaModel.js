const db = require('../database/db');

const TemperaturaModel = {
  
  // Verifica se o usuário tem um sensor de temperatura
  buscarSensorPorUsuario: (cod_usuario) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT st.cod_sensor, st.codigo, st.descricao 
        FROM sensor_temperatura st
        JOIN usuario_sensor_temperatura ust ON ust.cod_sensor = st.cod_sensor
        WHERE ust.cod_usuario = ?
      `;
      db.get(sql, [cod_usuario], (err, row) => {
        if (err) reject(err);
        else resolve(row); // Retorna null se não tiver sensor
      });
    });
  },

  // Lista medições de temperatura de um sensor
  listarUltimasPorPeriodo: (cod_sensor, horas) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT temperatura, umidade, data_hora 
        FROM temperatura 
        WHERE cod_sensor = ? AND data_hora >= datetime('now', ?)
        ORDER BY data_hora ASC
      `;
      db.all(sql, [cod_sensor, `-${horas} hours`], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Salvar nova medição
  salvar: (temperatura, umidade, cod_sensor) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO temperatura (temperatura, umidade, cod_sensor) VALUES (?, ?, ?)`;
      db.run(sql, [temperatura, umidade, cod_sensor], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  cadastrarSensor: (codigo, descricao, cod_usuario) => {
  return new Promise((resolve, reject) => {
    const sqlSensor = `INSERT INTO sensor_temperatura (codigo, descricao) VALUES (?, ?)`;
    db.run(sqlSensor, [codigo, descricao], function(err) {
      if (err) return reject(err);

      const cod_sensor_inserido = this.lastID;

      const sqlRelacionamento = `INSERT INTO usuario_sensor_temperatura (cod_usuario, cod_sensor) VALUES (?, ?)`;
      db.run(sqlRelacionamento, [cod_usuario, cod_sensor_inserido], function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
  });
},
};

module.exports = TemperaturaModel;
