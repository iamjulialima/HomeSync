const express = require('express');
const router = express.Router();
const TemperaturaController = require('../controllers/temperaturaController');

router.post('/salvar', TemperaturaController.salvar);
router.get('/ultimas', TemperaturaController.listarUltimasPorPeriodo);

module.exports = router;
