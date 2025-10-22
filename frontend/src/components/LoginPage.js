import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    setErro('');
    const resp = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await resp.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      setErro(data.erro || 'Erro ao logar');
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={e => setEmail(e.target.value)} />
      <TextField label="Senha" type="password" fullWidth sx={{ mb: 2 }} value={senha} onChange={e => setSenha(e.target.value)} />
      {erro && <Typography color="error">{erro}</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Entrar</Button>
    </Paper>
  );
}