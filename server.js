const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cadastro
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  const existe = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (existe) return res.status(400).json({ erro: 'Email já cadastrado' });
  db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)').run(nome, email, senha);
  res.json({ sucesso: true });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND senha = ?').get(email, senha);
  if (!usuario) return res.status(401).json({ erro: 'Login inválido' });
  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

// Middleware de autenticação
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ erro: 'Token não enviado' });
  try {
    const [, token] = header.split(' ');
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

// CRUD Treinos
app.get('/api/treinos', auth, (req, res) => {
  const treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(req.user.id);
  res.json(treinos.map(t => ({ ...t, dias: JSON.parse(t.dias) })));
});

app.post('/api/treinos', auth, (req, res) => {
  const { objetivo, semana, dias } = req.body;
  db.prepare('INSERT INTO treinos (user_id, objetivo, semana, dias) VALUES (?, ?, ?, ?)').run(
    req.user.id, objetivo, semana, JSON.stringify(dias)
  );
  res.json({ sucesso: true });
});

app.put('/api/treinos/:id', auth, (req, res) => {
  const { objetivo, semana, dias } = req.body;
  db.prepare('UPDATE treinos SET objetivo = ?, semana = ?, dias = ? WHERE id = ? AND user_id = ?').run(
    objetivo, semana, JSON.stringify(dias), req.params.id, req.user.id
  );
  res.json({ sucesso: true });
});

app.delete('/api/treinos/:id', auth, (req, res) => {
  db.prepare('DELETE FROM treinos WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ sucesso: true });
});

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'));