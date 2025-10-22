const express = require('express');
const { buildTCX } = require('tcx-builder');
const { buscarPorId } = require('../models/Treino'); // Ajuste para buscar treino por id
const router = express.Router();

router.get('/treino/:id/exportar', async (req, res) => {
  const id = req.params.id;
  const treino = buscarPorId(id); // Implemente buscarPorId em models/Treino.js
  if (!treino) return res.status(404).send('Treino não encontrado');

  const tcx = buildTCX({
    activities: [
      {
        sport: 'Biking',
        laps: treino.dias.map(dia => ({
          totalTimeSeconds: parseInt(dia.duracao) * 60,
          intensity: dia.intensidade,
          notes: dia.observacao,
        }))
      }
    ]
  });

  res.setHeader('Content-Disposition', 'attachment; filename=treino.tcx');
  res.setHeader('Content-Type', 'application/xml');
  res.send(tcx);
});

module.exports = router;