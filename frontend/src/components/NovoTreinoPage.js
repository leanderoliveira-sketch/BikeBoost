import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function NovoTreinoPage() {
  const [objetivo, setObjetivo] = useState('');
  const [semana, setSemana] = useState('');
  const [dias, setDias] = useState([{ dia: '', tipo: '', duracao: '', intensidade: '' }]);
  const navigate = useNavigate();

  function handleAddDia() {
    setDias([...dias, { dia: '', tipo: '', duracao: '', intensidade: '' }]);
  }

  function handleDiaChange(i, campo, valor) {
    setDias(dias.map((d, idx) => idx === i ? { ...d, [campo]: valor } : d));
  }

  async function handleSalvar() {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3001/api/treinos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ objetivo, semana, dias })
    });
    navigate('/dashboard');
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Novo Treino</Typography>
      <TextField label="Objetivo" fullWidth sx={{ mb: 2 }} value={objetivo} onChange={e => setObjetivo(e.target.value)} />
      <TextField label="Semana" type="number" fullWidth sx={{ mb: 2 }} value={semana} onChange={e => setSemana(e.target.value)} />
      {dias.map((dia, i) => (
        <Box key={i} sx={{ mb: 2, border: '1px solid #eee', p: 2, borderRadius: 2 }}>
          <TextField label="Dia" sx={{ mr: 1 }} value={dia.dia} onChange={e => handleDiaChange(i, 'dia', e.target.value)} />
          <TextField label="Tipo" sx={{ mr: 1 }} value={dia.tipo} onChange={e => handleDiaChange(i, 'tipo', e.target.value)} />
          <TextField label="Duração (min)" sx={{ mr: 1 }} value={dia.duracao} onChange={e => handleDiaChange(i, 'duracao', e.target.value)} />
          <TextField label="Intensidade" value={dia.intensidade} onChange={e => handleDiaChange(i, 'intensidade', e.target.value)} />
        </Box>
      ))}
      <Button sx={{ mb: 2 }} onClick={handleAddDia}>Adicionar Dia</Button>
      <Button variant="contained" color="primary" fullWidth onClick={handleSalvar}>Salvar Treino</Button>
    </Paper>
  );
}