const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const treinosRoutes = require('./routes/treinos');

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));