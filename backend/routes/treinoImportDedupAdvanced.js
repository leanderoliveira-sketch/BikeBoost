const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const stringSimilarity = require('string-similarity');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

// Função para verificar se dois treinos são duplicados
function isDuplicate(t, treinosExistentes, toleranciaMin = 10, toleranciaDist = 0.1, toleranciaDias = 1) {
  const diaNovo = t.dias[0];
  const dataNovo = new Date(diaNovo.dia);
  for (const existente of treinosExistentes) {
    const diaExistente = JSON.parse(existente.dias)[0];
    const dataExistente = new Date(diaExistente.dia);

    // Nome similar (>0.75)
    const nomeSimilar = stringSimilarity.compareTwoStrings(
      (diaNovo.nome || t.objetivo || ''),
      (diaExistente.nome || existente.objetivo || '')
    ) > 0.75;

    // Diferença de tempo em minutos
    const durNovo = parseFloat(diaNovo.duracao);
    const durExist = parseFloat(diaExistente.duracao);
    const tempoSimilar = Math.abs(durNovo - durExist) <= toleranciaMin;

    // Diferença de distância
    const distNovo = parseFloat(diaNovo.distancia || 0);
    const distExist = parseFloat(diaExistente.distancia || 0);
    const distSimilar = (distNovo && distExist) ?
      Math.abs(distNovo - distExist) <= toleranciaDist * distExist : true;

    // Diferença de dias (data)
    const diasDiff = Math.abs((dataNovo - dataExistente) / (1000 * 60 * 60 * 24));
    const dataSimilar = diasDiff <= toleranciaDias;

    // Mesma fonte/tipo
    const fonteIgual = t.ciclo === existente.ciclo;
    const tipoIgual = diaNovo.tipo === diaExistente.tipo;

    if (nomeSimilar && tempoSimilar && distSimilar && dataSimilar && fonteIgual && tipoIgual) {
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
    if (!isDuplicate(t, treinosExistentes, 10, 0.1, 1)) {
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