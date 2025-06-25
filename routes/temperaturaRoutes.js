const express = require('express');
const router = express.Router();
const TemperaturaController = require('../controllers/temperaturaController');

router.post('/salvar', TemperaturaController.salvar);
router.get('/sensor', TemperaturaController.verificarSensor);
router.get('/ultimas', TemperaturaController.listarUltimasPorPeriodo);
router.post('/sensor', TemperaturaController.cadastrarSensor);
router.post('/sensor', TemperaturaController.salvarSensor);

module.exports = router;
