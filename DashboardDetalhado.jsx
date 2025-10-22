import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardDetalhado = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Dashboard Detalhado</h2>
      <Line data={{
        labels: data.semanas,
        datasets: [{ label: 'Horas/Semana', data: data.horasPorSemana, borderColor: 'blue' }]
      }} />
      <Bar data={{
        labels: data.tipos,
        datasets: [{ label: 'Treinos por tipo', data: data.qtdPorTipo, backgroundColor: 'orange' }]
      }} />
      <div>Intensidade média: {data.intensidadeMedia.toFixed(2)}</div>
    </div>
  );
};

export default DashboardDetalhado;