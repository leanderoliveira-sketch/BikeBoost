const express = require('express');
const webpush = require('web-push');
const router = express.Router();

// Gere suas chaves VAPID usando web-push generate-vapid-keys
const VAPID_KEYS = {
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY'
};
webpush.setVapidDetails(
  'mailto:seuemail@dominio.com',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

// Simulação: subscriptions em memória
const subscriptionsDB = {}; // user_id: [subscriptions]

router.post('/push/subscribe', (req, res) => {
  const { user_id, subscription } = req.body;
  if (!user_id || !subscription) return res.status(400).json({ erro: 'Dados obrigatórios' });
  subscriptionsDB[user_id] = subscriptionsDB[user_id] || [];
  subscriptionsDB[user_id].push(subscription);
  res.json({ sucesso: true });
});

router.post('/push/send', async (req, res) => {
  const { user_id, title, body } = req.body;
  const subs = subscriptionsDB[user_id] || [];
  for (const sub of subs) {
    await webpush.sendNotification(sub, JSON.stringify({ title, body }));
  }
  res.json({ sucesso: true });
});

module.exports = router;