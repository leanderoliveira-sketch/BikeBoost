import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import GerarTreino from './GerarTreino';

export default function DashboardPage() {
  const [treinos, setTreinos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/treinos', {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        if (!res.ok) throw new Error('Falha ao carregar treinos');
        const data = await res.json();
        setTreinos(data || []);
      } catch (err) {
        setError(err.message || 'Erro');
      }
    }
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={2}>Dashboard</Typography>
      <Button component={Link} to="/novo-treino" variant="contained" sx={{ mb: 2 }}>Novo Treino</Button>
      <GerarTreino />
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {treinos.map(t => (
          <ListItem key={t.id}>
            <ListItemText primary={t.titulo || `Treino ${t.id}`} secondary={t.descricao || ''} />
            <Button component={Link} to={`/editar-treino/${t.id}`} variant="outlined">Editar</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
