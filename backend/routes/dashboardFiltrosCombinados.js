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
  const { fonte, tipo, intensidade, semana } = req.query;

  let query = 'SELECT * FROM treinos WHERE user_id = ?';
  let params = [user_id];

  if (fonte) {
    query += ' AND fonte = ?';
    params.push(fonte);
  }
  if (tipo) {
    query += ' AND dias LIKE ?';
    params.push(`%"tipo":"${tipo}"%`);
  }
  if (intensidade) {
    query += ' AND dias LIKE ?';
    params.push(`%"intensidade":"${intensidade}"%`);
  }
  if (semana) {
    query += ' AND semana = ?';
    params.push(Number(semana));
  }

  const treinos = db.prepare(query).all(...params);

  // Retorna opções para filtro dinâmico no frontend
  const fontes = [...new Set(db.prepare('SELECT fonte FROM treinos WHERE user_id = ?').all(user_id).map(t => t.fonte))];
  const tipos = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.tipo) : [])))];
  const intensidades = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.intensidade) : [])))];
  const semanas = [...new Set(treinos.map(t => t.semana))];

  res.json({ treinos, fontes, tipos, intensidades, semanas });
});

module.exports = router;