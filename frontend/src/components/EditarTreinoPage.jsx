import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditarTreinoPage() {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/treinos/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' }});
        if (!res.ok) throw new Error('Não encontrado');
        const data = await res.json();
        setTitulo(data.titulo || '');
        setDescricao(data.descricao || '');
      } catch (err) {
        setMsg(err.message || 'Erro');
      }
    }
    load();
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/treinos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ titulo, descricao })
      });
      if (!res.ok) throw new Error('Falha ao atualizar');
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.message || 'Erro ao salvar');
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir treino?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/treinos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      if (!res.ok) throw new Error('Falha ao excluir');
      navigate('/dashboard');
    } catch (err) {
      setMsg(err.message || 'Erro ao excluir');
    }
  }

  return (
    <Box maxWidth={720}>
      <Typography variant="h5" mb={2}>Editar Treino</Typography>
      {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}
      <form onSubmit={handleSave}>
        <TextField fullWidth label="Título" value={titulo} onChange={e => setTitulo(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} sx={{ mb: 2 }} multiline rows={4} />
        <Button variant="contained" type="submit" sx={{ mr: 1 }}>Salvar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Excluir</Button>
      </form>
    </Box>
  );
}
