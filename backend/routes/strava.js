const express = require('express');
const axios = require('axios');
const router = express.Router();

// Substitua pelos seus dados de app Strava!
const CLIENT_ID = 'YOUR_STRAVA_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_STRAVA_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_BACKEND_URL/api/strava/callback';

router.get('/strava/auth', (req, res) => {
  const url = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=auto&scope=activity:read`;
  res.redirect(url);
});

router.get('/strava/callback', async (req, res) => {
  const code = req.query.code;
  const tokenResp = await axios.post('https://www.strava.com/oauth/token', null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    }
  });
  // Salve tokens do usuário no banco!
  res.json(tokenResp.data);
});

// Exemplo: buscar atividades no Strava
router.get('/strava/atividades', async (req, res) => {
  const userAccessToken = 'TOKEN_DO_USUARIO'; // Recupere do banco
  const resp = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: { Authorization: `Bearer ${userAccessToken}` }
  });
  res.json(resp.data);
});

module.exports = router;