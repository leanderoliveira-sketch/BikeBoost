const express = require('express');
const axios = require('axios');
const router = express.Router();

// Coloque seu token HuggingFace aqui!
const HF_TOKEN = 'hf_xxx_seutoken_xxx';

router.post('/ia', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
    );
    res.json({ resposta: response.data[0]?.generated_text || JSON.stringify(response.data) });
  } catch (err) {
    res.status(500).json({ erro: 'Erro na IA', detalhe: err.message });
  }
});

module.exports = router;