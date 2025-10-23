
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('Falha no cadastro');
      setMsg('Cadastro realizado. Faça login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setMsg(err.message || 'Erro no cadastro');
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h5" mb={2}>Cadastro</Typography>
      {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Nome" value={name} onChange={e => setName(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" type="submit">Criar conta</Button>
      </form>
    </Box>
  );
}
