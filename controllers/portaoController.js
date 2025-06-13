const Comando = require('../models/portaoModel');

class PortaoController {
  getComando(req, res) {
    const comandoAtual = Comando.ultimo();
    res.json({ comando: comandoAtual });
  }

  abrir(req, res) {
    const { cod_usuario } = req.body;
    Comando.criar("abrir", cod_usuario);
    res.json({ sucesso: true, mensagem: "Comando abrir enviado." });
  }

  fechar(req, res) {
    const { cod_usuario } = req.body;
    Comando.criar("fechar", cod_usuario);
    res.json({ sucesso: true, mensagem: "Comando fechar enviado." });
  }

  historico(req, res) {
  Comando.listarHistorico((err, dados) => {
    if (err) {
      res.status(500).json({ erro: "Erro ao buscar histórico" });
    } else {
      res.json(dados);
    }
  });
}


}

module.exports = PortaoController;
