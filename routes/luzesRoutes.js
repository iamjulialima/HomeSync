const express = require('express');
const router = express.Router();
const luzesController = require('../controllers/luzesController');

router.get('/luzes', luzesController.listarLuzes);

router.put('/luzes/:id', luzesController.atualizarLuz);

router.delete('/luzes/:id', luzesController.removerLuz);

router.post('/luzesCriar', luzesController.criarLuz);

module.exports = router;
