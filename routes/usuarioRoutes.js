const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);
router.post('/esqueceuSenha', usuarioController.esqueceuSenha);

module.exports = router;