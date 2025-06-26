const express = require('express');
const router = express.Router();
const PortaoController = require('../controllers/portaoController');

const portaoController = new PortaoController();

router.get('/comando', (req, res) => portaoController.getComando(req, res));
router.post('/abrir', (req, res) => portaoController.abrir(req, res));
router.post('/fechar', (req, res) => portaoController.fechar(req, res));
router.get('/historico', (req, res) => portaoController.historico(req, res));
router.get('/sensor', (req, res) => portaoController.sensorPorUsuario(req, res));
router.post('/sensor', (req, res) => portaoController.cadastrarSensor(req, res));

module.exports = router;
