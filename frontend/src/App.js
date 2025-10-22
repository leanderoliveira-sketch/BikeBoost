import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import LoginPage from './components/LoginPage';
import CadastroPage from './components/CadastroPage';
import DashboardPage from './components/DashboardPage';
import NovoTreinoPage from './components/NovoTreinoPage';
import EditarTreinoPage from './components/EditarTreinoPage';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>BikeBoost</Typography>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/novo-treino">Novo Treino</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/cadastro">Cadastro</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/novo-treino" element={<PrivateRoute><NovoTreinoPage /></PrivateRoute>} />
          <Route path="/editar-treino/:id" element={<PrivateRoute><EditarTreinoPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Container>
    </Router>
  );
}
