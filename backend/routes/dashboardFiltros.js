const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

function auth(req, res, next) {
  // ... igual exemplo anterior
}

router.get('/dashboard', auth, (req, res) => {
  const user_id = req.user.id;
  const { fonte } = req.query; // fonte: 'local', 'Strava', 'GoogleFit' ou undefined para todos
  let treinos;
  if (fonte) {
    treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ? AND fonte = ?').all(user_id, fonte);
  } else {
    treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);
  }
  // ... agregação igual exemplo anterior
  // Retorne também fontes disponíveis
  const fontes = [...new Set(db.prepare('SELECT fonte FROM treinos WHERE user_id = ?').all(user_id).map(t => t.fonte))];
  res.json({ fontes, treinos });
});

module.exports = router;