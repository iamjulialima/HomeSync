const luzesModel = require('../models/luzesModel');

// Listar todas as luzes de um usuário específico
const listarLuzes = (req, res) => {
  const cod_usuario = req.params.cod_usuario; // ou req.user.cod_usuario se usar autenticação

  luzesModel.getLuzesPorUsuario(cod_usuario, (err, luzes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar luzes.' });
    }
    res.status(200).json(luzes);
  });
};

// Atualizar estado/intensidade da luz
const atualizarLuz = (req, res) => {
  const cod_luz = req.params.cod_luz;
  const { estado, intensidade } = req.body;
  const cod_usuario = req.body.cod_usuario; // ou req.user.cod_usuario se usar autenticação

  // Verifica se a luz pertence ao usuário
  luzesModel.getLuzPorId(cod_luz, (err, luz) => {
    if (err || !luz || luz.cod_usuario != cod_usuario) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    luzesModel.atualizarLuz(cod_luz, estado, intensidade, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar luz' });
      }
      res.status(200).json({ message: 'Luz atualizada com sucesso' });
    });
  });
};

// Criar nova luz e associar ao usuário
const criarLuz = (req, res) => {
  const { nome, localizacao, cod_usuario } = req.body;

  if (!nome || !localizacao || !cod_usuario) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const intensidade = 'media';
  const estado = 'desligado';

  luzesModel.criarLuz(nome, localizacao, intensidade, estado, cod_usuario, (err, novaLuz) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao criar luz.' });
    }
    res.status(201).json(novaLuz);
  });
};

module.exports = {
  listarLuzes,
  criarLuz,
  atualizarLuz,
};