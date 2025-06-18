// controllers/TemperaturaController.js
const TemperaturaModel = require('../models/temperaturaModel');

const TemperaturaController = {
  salvar: async (req, res) => {
    try {
      const { temperatura, umidade } = req.body;

      if (temperatura == null || umidade == null) {
        return res.status(400).json({ error: 'Temperatura e umidade são obrigatórios.' });
      }

      const resultado = await TemperaturaModel.salvar(temperatura, umidade);
      res.status(201).json({ message: 'Dados salvos com sucesso', id: resultado.id });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao salvar dados.' });
    }
  },

  listarUltimasPorPeriodo: async (req, res) => {
    try {
      const horas = parseInt(req.query.horas) || 2; // padrão 2 horas
      const dados = await TemperaturaModel.listarUltimasPorPeriodo(horas);
      res.json(dados);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  }
};

module.exports = TemperaturaController;