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
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

// Importação com deduplicação
router.post('/treinos/import/json', auth, (req, res) => {
  const { treinos } = req.body;
  if (!Array.isArray(treinos)) return res.status(400).json({ erro: 'Formato inválido' });
  let adicionados = 0, ignorados = 0;
  treinos.forEach(t => {
    // Usa um hash único para cada treino (ex: data + tipo + fonte)
    const hash = `${t.dias[0].dia}_${t.dias[0].tipo}_${t.ciclo}`;
    const existe = db.prepare('SELECT * FROM treinos WHERE user_id = ? AND hash = ?').get(req.user.id, hash);
    if (!existe) {
      db.prepare('INSERT INTO treinos (user_id, ciclo, semana, nivel, objetivo, dias, hash, fonte) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(req.user.id, t.ciclo, t.semana, t.nivel, t.objetivo, JSON.stringify(t.dias), hash, t.ciclo);
      adicionados++;
    } else {
      ignorados++;
    }
  });
  res.json({ sucesso: true, adicionados, ignorados });
});

module.exports = router;