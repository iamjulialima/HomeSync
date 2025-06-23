const nodemailer = require('nodemailer');
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

const esqueceuSenha = (req, res) => {
  const { email } = req.body;

  usuarioModel.buscarUsuarioPorEmail(email, async (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro interno no servidor' });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const novaSenha = Math.random().toString(36).slice(-8); // Ex: 'a1b2c3d4'

    bcrypt.hash(novaSenha, 10, (err, hash) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha' });

      usuarioModel.atualizarSenha(email, hash, async (err) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar senha' });

        // Configurar envio de e-mail
        const transporter = nodemailer.createTransport({
          service: 'gmail', // ou outro serviço
          auth: {
            user: 'flashlearn34@gmail.com',
            pass: 'senha_app'
          }
        });

        const mailOptions = {
          from: 'flashlearn34@gmail.com',
          to: email,
          subject: 'Recuperação de senha - HomeSync',
          text: `Olá ${usuario.nome},\n\nSua nova senha é: ${novaSenha}\n\nRecomendamos que você altere essa senha após o login.\n\nAtenciosamente,\nEquipe HomeSync`
        };

        try {
          await transporter.sendMail(mailOptions);
          res.json({ mensagem: 'E-mail enviado com sucesso' });
        } catch (erroEmail) {
          console.error('Erro ao enviar e-mail:', erroEmail);
          res.status(500).json({ erro: 'Erro ao enviar e-mail' });
        }
      });
    });
  });
};

const atualizarDados = (req, res) => {
  const { id, nome, email } = req.body;

  usuarioModel.atualizarUsuario(id, nome, email, (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    res.json({ mensagem: 'Dados atualizados com sucesso' });
  });
};

const atualizarSenha = (req, res) => {
  const { id, senhaAtual, novaSenha } = req.body;

  usuarioModel.buscarUsuarioPorId(id, (err, usuario) => {
    if (err || !usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    bcrypt.compare(senhaAtual, usuario.senha, (err, match) => {
      if (err || !match) return res.status(401).json({ erro: 'Senha atual incorreta' });

      bcrypt.hash(novaSenha, 10, (err, hash) => {
        if (err) return res.status(500).json({ erro: 'Erro ao criptografar nova senha' });

        usuarioModel.atualizarSenhaPorId(id, hash, (err) => {
          if (err) return res.status(500).json({ erro: 'Erro ao atualizar senha' });
          res.json({ mensagem: 'Senha atualizada com sucesso' });
        });
      });
    });
  });
};

const buscarUsuarioPorId = (req, res) => {
  const id = req.params.id;

  usuarioModel.buscarUsuarioPorId(id, (err, usuario) => {
    if (err || !usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  });
};



module.exports = {
  cadastrar,
  login,
  esqueceuSenha,
  atualizarDados,
  atualizarSenha,
  buscarUsuarioPorId
};