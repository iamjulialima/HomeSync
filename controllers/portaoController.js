const Comando = require('../models/portaoModel');

class PortaoController {
  // Retorna o último comando e reseta para "nada"
  getComando(req, res) {
    const comandoAtual = Comando.ultimo();
    res.json({ comando: comandoAtual });
    if (comandoAtual !== "nada") {
      Comando.criar("nada");
    }
  }

  abrir(req, res) {
    Comando.criar("abrir");
    res.json({ sucesso: true, mensagem: "Comando abrir enviado." });
  }

  fechar(req, res) {
    Comando.criar("fechar");
    res.json({ sucesso: true, mensagem: "Comando fechar enviado." });
  }
}

module.exports = PortaoController;