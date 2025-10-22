import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => resp.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Meu Dashboard</h2>
      <div>Total de treinos: {stats.totalTreinos}</div>
      <div>Total de horas: {stats.totalHoras}</div>
      <div>Semana atual: {stats.semanaAtual}</div>
      {/* Adicione gráficos e outras estatísticas */}
    </div>
  );
};

export default Dashboard;