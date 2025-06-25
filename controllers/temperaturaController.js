const TemperaturaModel = require('../models/temperaturaModel');

const TemperaturaController = {

   salvar: async (req, res) => {
  try {
    const { temperatura, umidade, cod_sensor } = req.body;

    if (temperatura == null || umidade == null || !cod_sensor) {
      return res.status(400).json({ error: 'Temperatura, umidade e cod_sensor são obrigatórios.' });
    }

    const resultado = await TemperaturaModel.salvar(temperatura, umidade, cod_sensor);
    res.status(201).json({ message: 'Dados salvos com sucesso', id: resultado.id });
  } catch (error) {
    console.error('Erro ao salvar temperatura:', error);
    res.status(500).json({ error: 'Erro ao salvar dados.' });
  }
},

  // Verifica se o usuário tem sensor cadastrado
  verificarSensor: async (req, res) => {
    try {
      const { cod_usuario } = req.query;
      if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado' });

      const sensor = await TemperaturaModel.buscarSensorPorUsuario(cod_usuario);

      if (sensor) {
        res.json({ possuiSensor: true, sensor });
      } else {
        res.json({ possuiSensor: false });
      }

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar sensor' });
    }
  },

  listarUltimasPorPeriodo: async (req, res) => {
    try {
      const { cod_usuario, horas } = req.query;
      if (!cod_usuario) return res.status(400).json({ error: 'Usuário não informado' });

      const sensor = await TemperaturaModel.buscarSensorPorUsuario(cod_usuario);
      if (!sensor) return res.status(404).json({ error: 'Usuário não possui sensor' });

      const dados = await TemperaturaModel.listarUltimasPorPeriodo(sensor.cod_sensor, horas || 2);
      res.json(dados);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  },

   cadastrarSensor: async (req, res) => {
    try {
      const { codigo, descricao, cod_usuario } = req.body;

      if (!codigo || !descricao || !cod_usuario) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
      }

      // Verifica se o usuário já tem sensor cadastrado
      const sensorExistente = await TemperaturaModel.buscarSensorPorUsuario(cod_usuario);
      if (sensorExistente) {
        return res.status(400).json({ error: 'Usuário já possui sensor cadastrado.' });
      }

      // Insere o sensor e relaciona ao usuário
      await TemperaturaModel.cadastrarSensor(codigo, descricao, cod_usuario);

      res.json({ message: 'Sensor cadastrado com sucesso!' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cadastrar sensor' });
    }
  },

  salvarSensor: async (req, res) => {
    try {
      const { codigo, descricao, cod_usuario } = req.body;
      if (!codigo || !descricao || !cod_usuario) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      await TemperaturaModel.cadastrarSensor(codigo, descricao, cod_usuario);
      res.status(201).json({ message: 'Sensor cadastrado com sucesso' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cadastrar sensor' });
    }
  }
};

module.exports = TemperaturaController;
