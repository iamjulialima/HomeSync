const luzesModel = require('../models/luzesModel');
const express = require('express');
const router = express.Router();//nao deveria estar aqui
const db = require('../database/db'); // conexão SQLite

const listarLuzes = (req, res) => {
  luzesModel.getTodasLuzes((err, luzes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar luzes.' });
    }
    res.status(200).json(luzes);
  });
};

// isso esta errado e deve ser consertado
router.get('/api/luzes', (req, res) => {
  db.all('SELECT * FROM luzes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = {
  listarLuzes,
  router,
};
