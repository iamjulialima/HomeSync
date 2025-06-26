const Comando = require('../models/portaoModel');

class PortaoController {

  async abrir(req, res) {
  const { cod_usuario } = req.body;
  if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado.' });

  try {
    const portao = await Comando.buscarPortaoPorUsuario(cod_usuario);
    if (!portao) {
      return res.status(403).json({ error: 'Usuário não possui portão cadastrado.' });
    }

    // Aqui você pode passar cod_portao para a função criar, se quiser
    Comando.criar("abrir", cod_usuario); 
    res.json({ sucesso: true, mensagem: "Comando abrir enviado para o portão: " + portao.codigo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
}
 async fechar(req, res) {
  const { cod_usuario } = req.body;
  if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado.' });

  try {
    const portao = await Comando.buscarPortaoPorUsuario(cod_usuario);
    if (!portao) {
      return res.status(403).json({ error: 'Usuário não possui portão cadastrado.' });
    }

    Comando.criar("fechar", cod_usuario);
    res.json({ sucesso: true, mensagem: "Comando fechar enviado para o portão: " + portao.codigo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno." });
  }
}
  async historico(req, res) {
    const cod_usuario = req.query.cod_usuario;
    if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado.' });

    const portao = await Comando.buscarPortaoPorUsuario(cod_usuario);
    if (!portao) {
      return res.status(403).json({ error: 'Usuário não possui portão cadastrado.' });
    }

    Comando.listarHistoricoPorPortao(portao.cod_portao, (err, dados) => {
      if (err) {
        res.status(500).json({ erro: "Erro ao buscar histórico" });
      } else {
        res.json(dados);
      }
    });
  }

  getComando(req, res) {
  const { cod_portao } = req.query;
  if (!cod_portao) return res.status(400).json({ error: 'Portão não informado' });

  Comando.buscarUltimoComandoPorPortao(cod_portao)
    .then((comando) => res.json({ comando: comando || "nenhum" }))
    .catch(() => res.status(500).json({ error: 'Erro ao buscar comando' }));
}

  sensorPorUsuario(req, res) {
  const { cod_usuario } = req.query;
  if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado' });

  Comando.buscarPortaoPorUsuario(cod_usuario)
    .then((portao) => {
      if (portao) {
        res.json({ possuiPortao: true, portao });
      } else {
        res.json({ possuiPortao: false });
      }
    })
    .catch(() => res.status(500).json({ error: 'Erro ao buscar portão' }));
}

cadastrarSensor(req, res) {
  const { codigo, descricao, cod_usuario } = req.body;

  if (!codigo || !descricao || !cod_usuario) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  Comando.buscarPortaoPorUsuario(cod_usuario)
    .then((portaoExistente) => {
      if (portaoExistente) {
        return res.status(400).json({ error: 'Usuário já possui portão cadastrado.' });
      }

      return Comando.cadastrarPortao(codigo, descricao, cod_usuario)
        .then(() => res.json({ message: 'Portão cadastrado com sucesso!' }));
    })
    .catch(() => res.status(500).json({ error: 'Erro ao cadastrar portão' }));
}


}

module.exports = PortaoController;
