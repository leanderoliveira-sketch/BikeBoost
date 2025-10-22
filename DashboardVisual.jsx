import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardVisual = () => {
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

  const dataLine = {
    labels: stats.semanas || [],
    datasets: [
      {
        label: 'Horas por semana',
        data: stats.horasPorSemana || [],
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.1)',
      }
    ]
  };

  const dataBar = {
    labels: stats.tipos || [],
    datasets: [
      {
        label: 'Treinos por tipo',
        data: stats.qtdPorTipo || [],
        backgroundColor: 'orange'
      }
    ]
  };

  return (
    <div>
      <h2>Dashboard Visual</h2>
      <div>
        <Line data={dataLine} />
      </div>
      <div>
        <Bar data={dataBar} />
      </div>
    </div>
  );
};

export default DashboardVisual;