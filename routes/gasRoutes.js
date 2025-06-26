const express = require('express');
const router = express.Router();

const gasController = require('../controllers/gasController');

router.post('/leitura', gasController.registrarLeitura);
router.get('/historico', gasController.listarHistorico);
router.post('/sensor', gasController.cadastrarSensor);
router.get('/existe-sensor', gasController.verificarSensorGas);

module.exports = router;
