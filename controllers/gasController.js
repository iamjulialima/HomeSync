const gasModel = require('../models/gasModel');

const registrarLeitura = async (req, res) => {
  try {
    const { valor, cod_sensor } = req.body;

    if (typeof valor !== 'number') {
      return res.status(400).json({ erro: 'Valor do sensor inválido.' });
    }

    if (!cod_sensor) {
      return res.status(400).json({ erro: 'Código do sensor obrigatório.' });
    }

    const limiteGas = 2000;
    const status = valor > limiteGas ? 'vazamento' : 'seguro';
    const data_hora = new Date().toISOString();

    await gasModel.salvarLeitura(valor, status, data_hora, cod_sensor);

    res.status(200).json({ mensagem: 'Leitura registrada com sucesso!', valor, status, data_hora, cod_sensor });
  } catch (err) {
    console.error('Erro ao registrar leitura do gás:', err);
    res.status(500).json({ erro: 'Erro ao registrar leitura do gás.' });
  }
};

const listarHistorico = async (req, res) => {
  try {
    const cod_usuario = req.query.cod_usuario;
    if (!cod_usuario) {
      return res.status(400).json({ erro: 'Usuário não informado.' });
    }

    const leituras = await gasModel.listarLeiturasPorUsuario(cod_usuario);
    res.status(200).json(leituras);
  } catch (err) {
    console.error('Erro ao buscar histórico de gás:', err);
    res.status(500).json({ erro: 'Erro ao buscar histórico de gás.' });
  }
};

const cadastrarSensor = async (req, res) => {
  try {
    const { codigo, descricao, cod_usuario } = req.body;

    if (!codigo || typeof codigo !== 'string' || !cod_usuario) {
      return res.status(400).json({ erro: 'Código do sensor e usuário são obrigatórios.' });
    }

    const resultado = await gasModel.cadastrarSensor(codigo, descricao || null);
    await gasModel.vincularSensorUsuario(cod_usuario, resultado.cod_sensor);

    res.status(201).json({ mensagem: 'Sensor cadastrado com sucesso!', cod_sensor: resultado.cod_sensor });
  } catch (err) {
    console.error('Erro ao cadastrar sensor de gás:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar sensor de gás.' });
  }
};


const verificarSensorGas = async (req, res) => {
  try {
    const cod_usuario = req.query.cod_usuario;
    if (!cod_usuario) return res.status(400).json({ erro: 'Usuário não informado.' });

    const existe = await gasModel.usuarioPossuiSensor(cod_usuario);
    res.json({ existe });
  } catch (err) {
    console.error('Erro ao verificar sensores de gás:', err);
    res.status(500).json({ erro: 'Erro ao verificar sensores de gás.' });
  }
};


module.exports = {
  registrarLeitura,
  listarHistorico,
  cadastrarSensor,
  verificarSensorGas
};
