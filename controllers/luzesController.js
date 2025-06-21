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


module.exports = {
  listarLuzes,
  atualizarLuz,
};
