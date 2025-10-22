import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/treinos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setTreinos);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Meus Treinos</Typography>
      {treinos.length === 0 && <Typography>Nenhum treino cadastrado ainda.</Typography>}
      {treinos.map(t => (
        <Paper key={t.id} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6">{t.objetivo} - Semana {t.semana}</Typography>
          <ul>
            {t.dias.map((dia, i) => (
              <li key={i}>{dia.dia}: {dia.tipo} - {dia.duracao} min - Intensidade: {dia.intensidade}</li>
            ))}
          </ul>
          <Button component={Link} to={`/editar-treino/${t.id}`} sx={{ mr: 1 }}>Editar</Button>
        </Paper>
      ))}
      <Button variant="contained" color="primary" component={Link} to="/novo-treino">Novo Treino</Button>
    </Box>
  );
}