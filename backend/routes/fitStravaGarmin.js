const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const FitEncoder = require('fit-file-encoder-js');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

// Exportação FIT
router.get('/treino/:id/export/fit', (req, res) => {
  // ... igual exemplo anterior
});

// Upload direto para Strava
router.post('/strava/upload-fit', async (req, res) => {
  const accessToken = req.body.accessToken; // Strava OAuth token
  const fitFile = req.body.fitFile; // FIT binário (base64 ou buffer)
  const resp = await fetch('https://www.strava.com/api/v3/uploads', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fitFile // multipart/form-data ou buffer
  });
  const data = await resp.json();
  res.json(data);
});

module.exports = router;