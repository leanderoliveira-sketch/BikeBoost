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
  let treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);

  // Intervalos de duração, distancia, data
  const minDuracao = req.query.minDuracao ? parseFloat(req.query.minDuracao) : null;
  const maxDuracao = req.query.maxDuracao ? parseFloat(req.query.maxDuracao) : null;
  const minDistancia = req.query.minDistancia ? parseFloat(req.query.minDistancia) : null;
  const maxDistancia = req.query.maxDistancia ? parseFloat(req.query.maxDistancia) : null;
  const minData = req.query.minData ? new Date(req.query.minData) : null;
  const maxData = req.query.maxData ? new Date(req.query.maxData) : null;

  treinos = treinos.filter(t => {
    const d = JSON.parse(t.dias)[0];
    let ok = true;
    if (minDuracao && parseFloat(d.duracao) < minDuracao) ok = false;
    if (maxDuracao && parseFloat(d.duracao) > maxDuracao) ok = false;
    if (minDistancia && parseFloat(d.distancia || 0) < minDistancia) ok = false;
    if (maxDistancia && parseFloat(d.distancia || 0) > maxDistancia) ok = false;
    if (minData && new Date(d.dia) < minData) ok = false;
    if (maxData && new Date(d.dia) > maxData) ok = false;
    return ok;
  });

  // Agregação/extras
  const tipos = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.tipo) : [])))];
  const intensidades = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.intensidade) : [])))];
  const semanas = [...new Set(treinos.map(t => t.semana))];
  const fontes = [...new Set(treinos.map(t => t.fonte))];

  res.json({ treinos, tipos, intensidades, semanas, fontes });
});

module.exports = router;