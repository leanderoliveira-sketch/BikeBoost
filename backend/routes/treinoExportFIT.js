const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const FitEncoder = require('fit-file-encoder-js');
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

// Exportação FIT
router.get('/treino/:id/export/fit', auth, async (req, res) => {
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!treino) return res.status(404).send('Treino não encontrado');
  const treinoObj = JSON.parse(treino.dias);

  // Exemplo mínimo de FIT
  const fit = new FitEncoder({
    fileId: { type: 'workout', manufacturer: 1, product: 1, serialNumber: 1234 },
    workout: {
      sport: 'cycling',
      capabilities: 0,
      numValidSteps: treinoObj.length
    },
    workoutSteps: treinoObj.map((dia, i) => ({
      intensity: dia.intensidade || 'active',
      durationType: 1, // time
      durationValue: parseInt(dia.duracao) * 60,
      targetType: 0,
      targetValue: 0
    }))
  });

  const fitFile = fit.getBuffer();
  res.setHeader('Content-Disposition', 'attachment; filename=treino.fit');
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(fitFile);
});

module.exports = router;