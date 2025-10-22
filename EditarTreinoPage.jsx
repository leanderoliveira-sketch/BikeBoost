import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function EditarTreinoPage() {
  const { id } = useParams();
  const [objetivo, setObjetivo] = useState('');
  const [semana, setSemana] = useState('');
  const [dias, setDias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/treinos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(treinos => {
        const treino = treinos.find(t => t.id === Number(id));
        if (treino) {
          setObjetivo(treino.objetivo);
          setSemana(treino.semana);
          setDias(treino.dias);
        }
      });
  }, [id]);

  function handleDiaChange(i, campo, valor) {
    setDias(dias.map((d, idx) => idx === i ? { ...d, [campo]: valor } : d));
  }

  async function handleSalvar() {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3001/api/treinos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ objetivo, semana, dias })
    });
    navigate('/dashboard');
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Editar Treino</Typography>
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
      <Button variant="contained" color="primary" fullWidth onClick={handleSalvar}>Salvar Alterações</Button>
    </Paper>
  );
}