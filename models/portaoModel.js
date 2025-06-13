const db = require('../database/db');

let ultimoComando = "nada";

const Portao = {
  criar: (comando) => {
    if (comando === "abrir" || comando === "fechar") {
      ultimoComando = comando;

      const stmt = db.prepare('INSERT INTO portao (comando) VALUES (?)');
      const info = stmt.run(comando);
      console.log("Salvando no banco:", comando);

      return info.lastInsertRowid;
    }
  },

  ultimo: () => {
    const comando = ultimoComando;
    ultimoComando = "nada";
    return comando;
  }
};

module.exports = Portao;
