const express = require('express');
const router = express.Router();
const luzesController = require('../controllers/luzesController');

router.get('/luzes/:cod_usuario', luzesController.listarLuzes);
router.put('/luzes/:cod_luz', luzesController.atualizarLuz);

router.delete('/luzes/:id', luzesController.removerLuz);
router.post('/luzesCriar', luzesController.criarLuz);

router.get('/luzes/:id', luzesController.getLuzPorId);

router.put('/luzes/:id/identidade', luzesController.editarIdentidadeLuz); 

module.exports = router;