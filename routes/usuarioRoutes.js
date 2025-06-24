const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);
router.post('/esqueceuSenha', usuarioController.esqueceuSenha);
router.put('/atualizarDados', usuarioController.atualizarDados);
router.put('/atualizarSenha', usuarioController.atualizarSenha);
router.get('/usuario/:id', usuarioController.buscarUsuarioPorId);

module.exports = router;
