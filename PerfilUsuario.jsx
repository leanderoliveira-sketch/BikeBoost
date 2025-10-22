import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField, Fade, Stack } from '@mui/material';

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState({ nome: '', email: '', avatar: '' });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/perfil', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPerfil(data));
  }, []);

  function handleEdit() { setEditando(true); }
  function handleSave() {
    const token = localStorage.getItem('token');
    fetch('/api/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: perfil.nome })
    }).then(() => setEditando(false));
  }

  return (
    <Fade in>
      <Box sx={{
        maxWidth: 480,
        mx: 'auto',
        mt: 4,
        p: 4,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: '#f7f7f7',
        textAlign: 'center'
      }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <Avatar src={perfil.avatar} sx={{ width: 72, height: 72 }} />
          <Typography variant="h5" fontWeight={600}>{perfil.nome}</Typography>
        </Stack>
        <Typography variant="body1">Email: {perfil.email}</Typography>
        {editando ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Nome"
              value={perfil.nome}
              onChange={e => setPerfil(p => ({ ...p, nome: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
          </Box>
        ) : (
          <Button sx={{ mt: 2 }} variant="outlined" onClick={handleEdit}>Editar perfil</Button>
        )}
      </Box>
    </Fade>
  );
}