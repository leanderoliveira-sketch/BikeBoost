const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota raiz para teste
app.get('/', (req, res) => {
  res.send('API do BikeBoost backend está funcionando!');
});

// Rota de login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123456') {
    res.json({ token: 'seu-token-aqui' });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rota GET para treino (pode ser usada para teste rápido)
app.get('/api/treino', (req, res) => {
  res.json({
    ciclo: 'Base',
    semana: 1,
    nivel: 'Intermediário',
    objetivo: 'Performance',
    dias: [
      { dia: 'Segunda', data: '2025-10-23', tipo: 'Endurance', duracao: '2h', intensidade: 'Moderada', observacao: '' },
      { dia: 'Quarta', data: '2025-10-25', tipo: 'Intervalado', duracao: '1h', intensidade: 'Alta', observacao: 'Sprints' }
      // ... outros dias
    ]
  });
});

// Rota POST para treino (usada pelo seu GerarTreino.jsx)
app.post('/api/treino', (req, res) => {
  const { objetivo, semana } = req.body;
  res.json({
    ciclo: 'Base',
    semana,
    nivel: 'Intermediário',
    objetivo,
    dias: [
      { dia: 'Segunda', data: '2025-10-23', tipo: 'Endurance', duracao: '2h', intensidade: 'Moderada', observacao: '' },
      { dia: 'Quarta', data: '2025-10-25', tipo: 'Intervalado', duracao: '1h', intensidade: 'Alta', observacao: 'Sprints' }
      // ... outros dias
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});