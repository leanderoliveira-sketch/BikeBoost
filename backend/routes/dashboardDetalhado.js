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
  const treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);
  const semanas = [...new Set(treinos.map(t => t.semana))];
  const horasPorSemana = semanas.map(sem =>
    treinos.filter(t => t.semana === sem)
      .reduce((soma, t) => soma + (t.dias ? JSON.parse(t.dias).reduce((a, d) => a + parseFloat(d.duracao), 0) : 0), 0)
  );
  const tipos = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.tipo) : [])))];
  const qtdPorTipo = tipos.map(tipo =>
    treinos.flatMap(t => (t.dias ? JSON.parse(t.dias) : []))
      .filter(d => d.tipo === tipo).length
  );
  // Novos dados: intensidade média, total por mês, etc.
  const intensidadeMedia = treinos.length ?
    (treinos.flatMap(t => (t.dias ? JSON.parse(t.dias) : []))
      .map(d => (d.intensidade === 'alta' ? 3 : d.intensidade === 'média' ? 2 : 1))
      .reduce((a, b) => a + b, 0) / treinos.length)
    : 0;
  res.json({ semanas, horasPorSemana, tipos, qtdPorTipo, intensidadeMedia });
});

module.exports = router;