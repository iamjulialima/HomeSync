const express = require('express');
const router = express.Router();
const luzesController = require('../controllers/luzesController');

router.get('/luzes/:cod_usuario', luzesController.listarLuzes);
router.put('/luzes/:cod_luz', luzesController.atualizarLuz);
router.post('/luzesCriar', luzesController.criarLuz);

module.exports = router;