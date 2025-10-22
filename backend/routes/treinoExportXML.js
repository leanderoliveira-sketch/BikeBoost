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

router.get('/treino/:id/export/xml', auth, (req, res) => {
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!treino) return res.status(404).send('Treino não encontrado');
  const treinoObj = JSON.parse(treino.dias);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<treino>
  <id>${treino.id}</id>
  <objetivo>${treino.objetivo}</objetivo>
  <semana>${treino.semana}</semana>
  <dias>
`;
  treinoObj.forEach(dia => {
    xml += `    <dia>
      <nome>${dia.dia}</nome>
      <tipo>${dia.tipo}</tipo>
      <duracao>${dia.duracao}</duracao>
      <intensidade>${dia.intensidade}</intensidade>
    </dia>
`;
  });
  xml += `  </dias>
</treino>`;

  res.setHeader('Content-Disposition', 'attachment; filename=treino.xml');
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;