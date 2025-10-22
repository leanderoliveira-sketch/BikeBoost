// Dependências
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3001;

// Simulação de banco de dados (array)
const users = [];
const treinos = [];

app.use(cors());
app.use(express.json());

const SECRET = 'segredo';

// Cadastro
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ erro: 'Email já cadastrado' });
  const hash = await bcrypt.hash(senha, 8);
  users.push({ nome, email, senha: hash });
  res.json({ sucesso: true });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ erro: 'Usuário não encontrado' });
  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.status(401).json({ erro: 'Senha inválida' });
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ token, nome: user.nome });
});

// Middleware de autenticação
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: 'Token não enviado' });
  try {
    const [, token] = authHeader.split(' ');
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

// Salvar treino
app.post('/api/treinos', auth, (req, res) => {
  const { email } = jwt.decode(req.headers.authorization.split(' ')[1]);
  const treino = { ...req.body, email };
  treinos.push(treino);
  res.json({ sucesso: true, treino });
});

// Listar treinos do usuário
app.get('/api/treinos', auth, (req, res) => {
  const { email } = jwt.decode(req.headers.authorization.split(' ')[1]);
  res.json(treinos.filter(t => t.email === email));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));