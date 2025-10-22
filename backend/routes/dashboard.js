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

router.get('/dashboard', auth, (req, res) => {
  const user_id = req.user.id;
  const treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);
  const totalTreinos = treinos.length;
  const totalHoras = treinos.reduce((acc, t) =>
    acc + (t.dias ? JSON.parse(t.dias).reduce((soma, dia) => soma + parseFloat(dia.duracao), 0) : 0)
  , 0);
  const semanaAtual = treinos.length ? treinos[0].semana : 0;
  res.json({ totalTreinos, totalHoras, semanaAtual });
});

module.exports = router;