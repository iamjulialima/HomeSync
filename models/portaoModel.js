const db = require('../database/db');

let ultimoComando = "nada";

const Portao = {
  criar: (comando, cod_usuario) => {
  if (comando !== ultimoComando && (comando === "abrir" || comando === "fechar")) {
    ultimoComando = comando;

    // Buscar o portão vinculado ao usuário
    const sql = `
      SELECT cod_portao FROM usuario_portao WHERE cod_usuario = ?
    `;
    db.get(sql, [cod_usuario], (err, row) => {
      if (err) {
        console.error('Erro ao buscar portão do usuário:', err.message);
        return;
      }
      if (!row) {
        console.log('Usuário não possui portão vinculado.');
        return;
      }

      const cod_portao = row.cod_portao;

      // Salvar o comando no histórico
      const insert = `
        INSERT INTO historico_portao (cod_portao, cod_usuario, comando)
        VALUES (?, ?, ?)
      `;
      db.run(insert, [cod_portao, cod_usuario, comando], function (err) {
        if (err) {
          console.error('Erro ao salvar histórico:', err.message);
        } else {
          console.log(`Comando '${comando}' salvo no histórico por usuário ${cod_usuario}`);
        }
      });
    });
  } else {
    console.log("Comando repetido, não salvou:", comando);
  }
},

ultimo: () => {
    return ultimoComando;
},

buscarPortaoPorUsuario: (cod_usuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.cod_portao, p.codigo, p.descricao
      FROM portao p
      JOIN usuario_portao up ON up.cod_portao = p.cod_portao
      WHERE up.cod_usuario = ?
    `;
    db.get(sql, [cod_usuario], (err, row) => {
      if (err) reject(err);
      else resolve(row); // null se não tiver
    });
  });
},

buscarUltimoComandoPorPortao: (cod_portao) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT comando FROM historico_portao
      WHERE cod_portao = ?
      ORDER BY dataHora DESC
      LIMIT 1
    `;
    db.get(sql, [cod_portao], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.comando : null);
    });
  });
},

cadastrarPortao: (codigo, descricao, cod_usuario) => {
  return new Promise((resolve, reject) => {
    const sqlPortao = `INSERT INTO portao (codigo, descricao) VALUES (?, ?)`;
    db.run(sqlPortao, [codigo, descricao], function(err) {
      if (err) return reject(err);

      const cod_portao_inserido = this.lastID;

      const sqlRelacionamento = `INSERT INTO usuario_portao (cod_usuario, cod_portao) VALUES (?, ?)`;
      db.run(sqlRelacionamento, [cod_usuario, cod_portao_inserido], function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
  });
},


  listarHistoricoPorPortao: (cod_portao, callback) => {
  const query = `
    SELECT p.comando, p.dataHora, u.nome AS usuario
    FROM historico_portao p
    JOIN usuario u ON p.cod_usuario = u.cod_usuario
    WHERE p.cod_portao = ?
    ORDER BY p.dataHora DESC
  `;

  db.all(query, [cod_portao], (err, rows) => {
    if (err) {
      console.error("Erro ao listar histórico:", err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
},

};

module.exports = Portao;
