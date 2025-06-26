const db = require('../database/db');

const salvarLeitura = (valor, status, data_hora, cod_sensor) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO gas (valor, status, dataHora, cod_sensor) VALUES (?, ?, ?, ?)';
    db.run(sql, [valor, status, data_hora, cod_sensor], function(err) {
      if (err) {
        console.error('Erro ao salvar leitura do gás:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const listarLeiturasPorUsuario = (cod_usuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.*
      FROM gas g
      JOIN usuario_sensor_gas usg ON usg.cod_sensor = g.cod_sensor
      WHERE usg.cod_usuario = ?
      ORDER BY g.dataHora DESC
    `;
    db.all(sql, [cod_usuario], (err, rows) => {
      if (err) {
        console.error('Erro ao listar leituras do gás:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};


const cadastrarSensor = async (codigo, descricao) => {
  const sql = 'INSERT INTO sensor_gas (codigo, descricao) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [codigo, descricao], function(err) {
      if (err) {
        console.error('Erro ao cadastrar sensor de gás:', err.message);
        reject(err);
      } else {
        resolve({ cod_sensor: this.lastID });
      }
    });
  });
};

const existeSensorGas = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS total FROM sensor_gas';
    db.get(sql, [], (err, row) => {
      if (err) {
        console.error('Erro ao verificar sensores de gás:', err.message);
        reject(err);
      } else {
        resolve(row.total > 0);
      }
    });
  });
};

const vincularSensorUsuario = (cod_usuario, cod_sensor) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO usuario_sensor_gas (cod_usuario, cod_sensor) VALUES (?, ?)';
    db.run(sql, [cod_usuario, cod_sensor], function(err) {
      if (err) {
        console.error('Erro ao vincular sensor ao usuário:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const usuarioPossuiSensor = (cod_usuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS total
      FROM usuario_sensor_gas
      WHERE cod_usuario = ?
    `;
    db.get(sql, [cod_usuario], (err, row) => {
      if (err) {
        console.error('Erro ao verificar sensores do usuário:', err.message);
        reject(err);
      } else {
        resolve(row.total > 0);
      }
    });
  });
};



module.exports = {
  salvarLeitura,
  listarLeiturasPorUsuario,
  cadastrarSensor,
  existeSensorGas,
  vincularSensorUsuario,
  usuarioPossuiSensor
};
