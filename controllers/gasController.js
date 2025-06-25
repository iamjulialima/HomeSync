const gasModel = require('../models/gasModel');

// Recebe a leitura do sensor e salva no banco
const registrarLeitura = (req, res) => {
  const { valor } = req.body;

  if (typeof valor !== 'number') {
    return res.status(400).json({ erro: 'Valor do sensor inválido.' });
  }

  // Define status conforme o limite do sensor 
  const limiteGas = 2000;
  const status = valor > limiteGas ? 'vazamento' : 'seguro';

  // Registra data e hora atual
  const data_hora = new Date().toISOString();

  gasModel.salvarLeitura(valor, status, data_hora, (err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao registrar leitura do gás.' });
    }
    res.status(200).json({ mensagem: 'Leitura registrada com sucesso!', valor, status, data_hora });
  });
};

// Busca histórico de leituras para frontend
const listarHistorico = (req, res) => {
  gasModel.listarLeituras((err, leituras) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar histórico de gás.' });
    }
    res.status(200).json(leituras);
  });
};

module.exports = {
  registrarLeitura,
  listarHistorico,
};
