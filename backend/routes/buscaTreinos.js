const express = require('express');
const jwt = require('jsonwebtoken');
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

router.get('/treinos', auth, (req, res) => {
  const user_id = req.user.id;
  const busca = req.query.busca?.toLowerCase() || '';
  let treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ? ORDER BY criado_em DESC').all(user_id);
  treinos = treinos.filter(t =>
    t.objetivo?.toLowerCase().includes(busca) ||
    t.ciclo?.toLowerCase().includes(busca) ||
    ('' + t.semana).includes(busca)
  ).map(t => ({ ...t, dias: JSON.parse(t.dias) }));
  res.json(treinos);
});

module.exports = router;