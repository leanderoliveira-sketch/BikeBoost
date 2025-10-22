import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NovoTreinoPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/treinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ titulo, descricao })
      });
      if (!res.ok) throw new Error('Falha ao criar treino');
      setMsg('Treino criado');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setMsg(err.message || 'Erro');
    }
  }

  return (
    <Box maxWidth={720}>
      <Typography variant="h5" mb={2}>Novo Treino</Typography>
      {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Título" value={titulo} onChange={e => setTitulo(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} sx={{ mb: 2 }} multiline rows={4} />
        <Button variant="contained" type="submit">Salvar</Button>
      </form>
    </Box>
  );
}
