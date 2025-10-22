const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const stringSimilarity = require('string-similarity');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

function auth(req, res, next) {
  // ... igual exemplo anterior
}

function isDuplicateTreino(t, treinosExistentes, toleranciaMinutos = 10, toleranciaDistancia = 0.1) {
  const diaNovo = t.dias[0];
  for (const existente of treinosExistentes) {
    const diaExistente = JSON.parse(existente.dias)[0];
    // Fuzzy matching do nome
    const nomeSimilar = stringSimilarity.compareTwoStrings(
      (diaNovo.nome || t.objetivo || ''),
      (diaExistente.nome || existente.objetivo || '')
    ) > 0.8;
    // Tolerância de tempo (em minutos)
    const duracaoNovo = parseFloat(diaNovo.duracao);
    const duracaoExistente = parseFloat(diaExistente.duracao);
    const tempoSimilar = Math.abs(duracaoNovo - duracaoExistente) <= toleranciaMinutos;
    // Tolerância de distância (em km ou m)
    const distanciaNovo = parseFloat(diaNovo.distancia || 0);
    const distanciaExistente = parseFloat(diaExistente.distancia || 0);
    const distSimilar = (
      distanciaNovo && distanciaExistente ?
      Math.abs(distanciaNovo - distanciaExistente) <= toleranciaDistancia * distanciaExistente :
      true
    );
    // Mesma data
    const dataIgual = diaNovo.dia === diaExistente.dia;
    // Mesma fonte e tipo
    const fonteIgual = t.ciclo === existente.ciclo;
    const tipoIgual = diaNovo.tipo === diaExistente.tipo;
    if (nomeSimilar && tempoSimilar && distSimilar && dataIgual && fonteIgual && tipoIgual) {
      return true;
    }
  }
  return false;
}

router.post('/treinos/import/json', auth, (req, res) => {
  const { treinos } = req.body;
  if (!Array.isArray(treinos)) return res.status(400).json({ erro: 'Formato inválido' });
  const treinosExistentes = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(req.user.id);
  let adicionados = 0, ignorados = 0;
  treinos.forEach(t => {
    if (!isDuplicateTreino(t, treinosExistentes)) {
      db.prepare('INSERT INTO treinos (user_id, ciclo, semana, nivel, objetivo, dias, fonte) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(req.user.id, t.ciclo, t.semana, t.nivel, t.objetivo, JSON.stringify(t.dias), t.ciclo);
      adicionados++;
    } else {
      ignorados++;
    }
  });
  res.json({ sucesso: true, adicionados, ignorados });
});

module.exports = router;