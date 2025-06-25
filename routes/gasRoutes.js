const express = require('express');
const router = express.Router();

const gasController = require('../controllers/gasController');

router.post('/gas/leitura', gasController.registrarLeitura);

router.get('/gas/historico', gasController.listarHistorico);

module.exports = router;
