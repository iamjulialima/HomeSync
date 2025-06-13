const db = require('../database/db');

let ultimoComando = "nada";

const Portao = {
  criar: (comando, cod_usuario) => {
    if (comando === "abrir" || comando === "fechar") {
      ultimoComando = comando;

      const stmt = db.prepare('INSERT INTO portao (comando, cod_usuario) VALUES (?, ?)');
      const info = stmt.run(comando, cod_usuario);
      console.log("Salvando no banco:", comando, "por usuário:", cod_usuario);

      return info.lastInsertRowid;
    }
  },

  ultimo: () => {
    const comando = ultimoComando;
    ultimoComando = "nada";
    return comando;
  },

  listarHistorico: (callback) => {
  const query = `
    SELECT p.comando, p.dataHora, u.nome AS usuario
    FROM portao p
    JOIN usuario u ON p.cod_usuario = u.cod_usuario
    ORDER BY p.dataHora DESC
  `;

  db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Erro ao listar histórico:", err.message);
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  }

};

module.exports = Portao;
