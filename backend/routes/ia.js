const express = require('express');
const axios = require('axios');
const router = express.Router();

try { require('dotenv').config(); } catch (e) {}

const HF_TOKEN = process.env.HF_TOKEN;

router.post('/ia', async (req, res) => {
  const { prompt } = req.body;

  if (!HF_TOKEN) {
    console.error('HF_TOKEN não configurado.');
    return res.status(500).json({ erro: 'Token Hugging Face não configurado (defina HF_TOKEN).' });
  }

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ erro: 'Campo "prompt" obrigatório e deve ser string.' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    let resposta;
    if (typeof response.data === 'string') {
      resposta = response.data;
    } else if (Array.isArray(response.data)) {
      resposta = response.data[0]?.generated_text || JSON.stringify(response.data);
    } else {
      resposta = response.data.generated_text || JSON.stringify(response.data);
    }

    res.json({ resposta });
  } catch (err) {
    console.error('Erro na chamada HuggingFace:', err.response?.data || err.message);
    res.status(500).json({ erro: 'Erro na IA', detalhe: err.response?.data || err.message });
  }
});

module.exports = router;
