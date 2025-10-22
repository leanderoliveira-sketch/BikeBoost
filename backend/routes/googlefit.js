const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'https://yourbackend.com/api/googlefit/callback';
const SCOPE = 'https://www.googleapis.com/auth/fitness.activity.read';
const JWT_SECRET = 'segredo_superseguro';

// Inicie o OAuth2
router.get('/googlefit/auth', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=offline`;
  res.redirect(url);
});

// Callback para receber o token
router.get('/googlefit/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResp = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }
    });
    // Salve os tokens de acesso/refresh do usuário no banco!
    res.json(tokenResp.data);
  } catch(e) {
    res.status(500).json({ erro: 'Erro no OAuth Google Fit', detalhe: e.message });
  }
});

// Buscar atividades do usuário autenticado (exemplo: últimos 7 dias)
router.get('/googlefit/atividades', async (req, res) => {
  const userAccessToken = 'TOKEN_DO_USUARIO'; // Recupere do banco!
  const now = Date.now();
  const lastWeek = now - 7*24*60*60*1000;
  try {
    const resp = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      aggregateBy: [{ dataTypeName: "com.google.activity.segment" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: lastWeek,
      endTimeMillis: now
    }, {
      headers: { Authorization: `Bearer ${userAccessToken}` }
    });
    res.json(resp.data);
  } catch(e) {
    res.status(500).json({ erro: 'Erro ao buscar dados do Google Fit', detalhe: e.message });
  }
});

module.exports = router;