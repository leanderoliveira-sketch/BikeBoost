import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function GerarTreino() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGerar(e) {
    e.preventDefault();
    setResultado('');
    setLoading(true);
    try {
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setResultado(data.resposta || JSON.stringify(data));
    } catch (err) {
      setResultado('Erro ao gerar: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box mb={3}>
      <Typography variant="h6" mb={1}>Gerar treino (IA)</Typography>
      <form onSubmit={handleGerar}>
        <TextField fullWidth label="Prompt" value={prompt} onChange={e => setPrompt(e.target.value)} sx={{ mb: 1 }} />
        <Button variant="outlined" type="submit" disabled={loading}>Gerar</Button>
      </form>
      {resultado && <Box mt={2}><Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{resultado}</Typography></Box>}
    </Box>
  );
}
