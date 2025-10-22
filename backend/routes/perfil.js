const express = require('express');
const jwt = require('jsonwebtoken');
const { buscarPorId } = require('../models/User');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: 'Token não enviado' });
  try {
    const [, token] = authHeader.split(' ');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

// GET perfil
router.get('/perfil', auth, (req, res) => {
  const user = buscarPorId(req.user.id);
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json({ nome: user.nome, email: user.email });
});

// UPDATE perfil
router.put('/perfil', auth, (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  db.prepare('UPDATE users SET nome = ? WHERE id = ?').run(nome, req.user.id);
  res.json({ sucesso: true });
});

module.exports = router;