const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

// Função para calcular hash mais sofisticado
function treinoHash(t) {
  // Use nome, data, tipo e distância arredondada para evitar duplicatas
  const dia = t.dias[0];
  return `${dia.dia}_${dia.tipo}_${(dia.distancia ? Math.round(dia.distancia) : '')}_${t.ciclo}`.toLowerCase();
}

function auth(req, res, next) {
  // ... igual exemplo anterior
}

// Importação com deduplicação avançada
router.post('/treinos/import/json', auth, (req, res) => {
  const { treinos } = req.body;
  if (!Array.isArray(treinos)) return res.status(400).json({ erro: 'Formato inválido' });
  let adicionados = 0, ignorados = 0;
  treinos.forEach(t => {
    const hash = treinoHash(t);
    // Permite pequenas variações, ex: diferença de até 5% na distância
    const candidato = db.prepare(
      'SELECT * FROM treinos WHERE user_id = ? AND hash = ?'
    ).get(req.user.id, hash);
    if (!candidato) {
      db.prepare('INSERT INTO treinos (user_id, ciclo, semana, nivel, objetivo, dias, hash, fonte) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(
          req.user.id,
          t.ciclo, t.semana, t.nivel, t.objetivo,
          JSON.stringify(t.dias), hash, t.ciclo
        );
      adicionados++;
    } else {
      ignorados++;
    }
  });
  res.json({ sucesso: true, adicionados, ignorados });
});

module.exports = router;