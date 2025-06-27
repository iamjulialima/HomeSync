const luzesModel = require('../models/luzesModel');
const gasModel = require('../models/gasModel');
const Comando = require('../models/portaoModel');
const TemperaturaModel = require('../models/temperaturaModel');

const verificarDispositivos = async (req, res) => {
  const cod_usuario = req.query.cod_usuario;

  if (!cod_usuario) {
    return res.status(400).json({ error: 'Usuário não informado.' });
  }

  try {
    const luzes = await new Promise((resolve, reject) => {
      luzesModel.getLuzesPorUsuario(cod_usuario, (err, dados) => {
        if (err) reject(err);
        else resolve(dados);
      });
    });

    const possuiLuzes = Array.isArray(luzes) && luzes.length > 0;

    const possuiSensorGas = await gasModel.usuarioPossuiSensor(cod_usuario);

    const portao = await Comando.buscarPortaoPorUsuario(cod_usuario);
    const possuiPortao = !!portao;

    const sensorTemp = await TemperaturaModel.buscarSensorPorUsuario(cod_usuario);
    const possuiSensorTemp = !!sensorTemp;

    res.json({
      possuiPortao,
      possuiSensor: possuiSensorTemp,
      existe: possuiSensorGas,
      existeLuzes: possuiLuzes
    });

  } catch (error) {
    console.error('Erro ao verificar dispositivos:', error);
    res.status(500).json({ error: 'Erro ao buscar dispositivos.' });
  }
};

module.exports = { verificarDispositivos };
