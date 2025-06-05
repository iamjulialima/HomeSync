const luzesModel = require('../models/luzesModel');

const listarLuzes = (req, res) => {
  luzesModel.getTodasLuzes((err, luzes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar luzes.' });
    }
    res.status(200).json(luzes);
  });
};

module.exports = {
  listarLuzes,
};
