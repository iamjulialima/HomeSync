const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

const cadastrar = (req, res) => {
  const { nome, email, senha } = req.body;

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha' });

    usuarioModel.criarUsuario(nome, email, hash, (err, id) => {
      if (err) return res.status(400).json({ erro: 'Erro ao cadastrar usuário (email já existe?)' });
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id });
    });
  });
};

const login = (req, res) => {
  const { email, senha } = req.body;

  usuarioModel.buscarUsuarioPorEmail(email, (err, usuario) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    bcrypt.compare(senha, usuario.senha, (err, resultado) => {
      if (err) {
        console.error('Erro no bcrypt:', err);
        return res.status(500).json({ erro: 'Erro interno no servidor' });
      }

      if (resultado) {
        res.json({ mensagem: 'Login realizado com sucesso', usuario });
      } else {
        res.status(401).json({ erro: 'Senha incorreta' });
      }
    });
  });
};

module.exports = {
  cadastrar,
  login,
};