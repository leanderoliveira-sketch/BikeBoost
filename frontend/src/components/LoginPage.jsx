// filepath: frontend/src/components/LoginPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    if (!email || !password) {
      setError('Preencha email e senha.');
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setError('Email inválido.');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Credenciais inválidas');
      }
      const data = await res.json();
      if (!data?.token) throw new Error('Resposta inválida do servidor');
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h5" mb={2}>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete="email"
          aria-label="email"
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete="current-password"
          aria-label="senha"
        />
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <><CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />Entrando...</> : 'Entrar'}
        </Button>
      </form>
    </Box>
  );
}
