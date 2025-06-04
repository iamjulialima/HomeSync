const express = require('express');
const bodyParser = require('body-parser');
const usuarioRoutes = require('./routes/usuarioRoutes');
const path = require('path');

require('./database/createTables'); 

const app = express();

app.use(bodyParser.json());

// Servir arquivos da pasta public/
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api', usuarioRoutes);

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
