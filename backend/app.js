const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const treinosRoutes = require('./routes/treinos');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de autenticação (cadastro/login)
app.use('/api', authRoutes);

// Rotas de treinos (protegidas)
app.use('/api/treinos', treinosRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API do BikeBoost backend está funcionando!');
});

module.exports = app;
