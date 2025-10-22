const express = require('express');
const jwt = require('jsonwebtoken');
const { salvarTreino, listarTreinosPorUsuario } = require('../models/Treino');
const { buscarPorId } = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

// Middleware de autenticação
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

// Salvar treino
router.post('/', auth, (req, res) => {
  const user = buscarPorId(req.user.id);
  if (!user) return res.status(401).json({ erro: 'Usuário não encontrado' });
  salvarTreino(user.id, req.body);
  res.json({ sucesso: true });
});

// Listar treinos do usuário
router.get('/', auth, (req, res) => {
  const treinos = listarTreinosPorUsuario(req.user.id);
  res.json(treinos);
});

module.exports = router;