const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

// Simulação: notificações em memória
const notificacoesDB = {
  // user_id: [ { id, texto, lida } ]
};

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: 'Token não enviado' });
  try {
    const [, token] = authHeader.split(' ');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

router.get('/notificacoes', auth, (req, res) => {
  const user_id = req.user.id;
  notificacoesDB[user_id] = notificacoesDB[user_id] || [
    { id: 1, texto: 'Treino gerado com sucesso!', lida: false },
    { id: 2, texto: 'Nova semana disponível!', lida: false }
  ];
  res.json(notificacoesDB[user_id]);
});

// Marcar como lida
router.post('/notificacoes/:id/lida', auth, (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const nots = notificacoesDB[user_id] || [];
  const idx = nots.findIndex(n => n.id == id);
  if (idx >= 0) nots[idx].lida = true;
  res.json({ sucesso: true });
});

module.exports = router;