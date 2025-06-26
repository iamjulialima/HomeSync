const luzesModel = require('../models/luzesModel');
const express = require('express');

const listarLuzes = (req, res) => {
  luzesModel.getTodasLuzes((err, luzes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar luzes.' });
    }
    res.status(200).json(luzes);
  });
};


//atualizar luz front intensidade e ligar/desligar
const  atualizarLuz = (req, res) => {
  const id = req.params.id;
  const { estado, intensidade } = req.body;

  luzesModel.atualizarLuz(id, estado, intensidade, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar luz' });
    }
    res.status(200).json({ message: 'Luz atualizada com sucesso' });
  });
}

const criarLuz = (req, res) => {
  const { cod, nome, localizacao } = req.body;

  if (!cod || !nome || !localizacao) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const intensidade = 'media';
  const estado = 'desligado';

  luzesModel.criarLuz(cod, nome, localizacao, intensidade, estado, (err, novaLuz) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao criar luz.' });
    }

    res.status(201).json(novaLuz);
  });
};

const removerLuz = (req, res) => {
  const id = req.params.id;

  luzesModel.removerLuz(id, (err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao remover luz.' });
    }
    res.status(200).json({ mensagem: 'Luz removida com sucesso.' });
  });
};

const getLuzPorId = (req, res) => {
  const id = req.params.id;
  luzesModel.getLuzPorId(id, (err, luz) => {
    if (err || !luz) {
      return res.status(404).json({ error: 'Luz não encontrada.' });
    }
    res.status(200).json(luz);
  });
};

const editarIdentidadeLuz = (req, res) => {
  const idOriginal = req.params.id;
  const { cod, nome, localizacao } = req.body;

  luzesModel.editarIdentidadeLuz(idOriginal, cod, nome, localizacao, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao editar identidade da luz.' });
    }
    res.status(200).json({ message: 'Identidade da luz editada com sucesso.' });
  });
};


module.exports = {
  listarLuzes,
  atualizarLuz,
  criarLuz,
  removerLuz,
  getLuzPorId,
  editarIdentidadeLuz,
};
