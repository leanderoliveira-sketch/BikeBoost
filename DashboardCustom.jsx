import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const DashboardCustom = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Meu Dashboard</h2>
      <div>
        <Line data={{
          labels: stats.semanas,
          datasets: [{ label: 'Horas/Semana', data: stats.horasPorSemana, borderColor: 'blue' }]
        }} />
      </div>
      <div>
        <Bar data={{
          labels: stats.tipos,
          datasets: [{ label: 'Treinos por tipo', data: stats.qtdPorTipo, backgroundColor: 'orange' }]
        }} />
      </div>
      <div>
        <Doughnut data={{
          labels: ['Baixa', 'Média', 'Alta'],
          datasets: [{ label: 'Intensidade', data: stats.qtdIntensidade, backgroundColor: ['#7fc8a9', '#f6e27a', '#e97777'] }]
        }} />
      </div>
      <div>
        <strong>Total de Treinos:</strong> {stats.totalTreinos}<br/>
        <strong>Total de Horas:</strong> {stats.totalHoras}<br/>
        <strong>Intensidade média:</strong> {stats.intensidadeMedia.toFixed(2)}
      </div>
    </div>
  );
};

export default DashboardCustom;