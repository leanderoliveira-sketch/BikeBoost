import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleCadastro() {
    setErro('');
    const resp = await fetch('http://localhost:3001/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await resp.json();
    if (data.sucesso) {
      navigate('/login');
    } else {
      setErro(data.erro || 'Erro ao cadastrar');
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Cadastro</Typography>
      <TextField label="Nome" fullWidth sx={{ mb: 2 }} value={nome} onChange={e => setNome(e.target.value)} />
      <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={e => setEmail(e.target.value)} />
      <TextField label="Senha" type="password" fullWidth sx={{ mb: 2 }} value={senha} onChange={e => setSenha(e.target.value)} />
      {erro && <Typography color="error">{erro}</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleCadastro}>Cadastrar</Button>
    </Paper>
  );
}