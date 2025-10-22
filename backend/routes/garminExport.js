const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

router.get('/treino/:id/export/tcx', (req, res) => {
  // ... igual exemplo anterior
  // O arquivo TCX pode ser enviado para Garmin Connect manualmente ou via API (se disponível)
});

module.exports = router;