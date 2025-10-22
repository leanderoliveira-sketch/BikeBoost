import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardPorMesAno = () => {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard/agregado', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, []);

  if (!dados) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Dashboard por Mês/Ano</h2>
      <Line data={{
        labels: dados.labels,
        datasets: [{ label: 'Horas/Mês', data: dados.totalHoras, borderColor: 'blue' }]
      }} />
      <Bar data={{
        labels: dados.labels,
        datasets: [{ label: 'Distância/Mês', data: dados.totalDistancia, backgroundColor: 'green' }]
      }} />
      <Bar data={{
        labels: dados.labels,
        datasets: [{ label: 'Treinos/Mês', data: dados.qtdTreinos, backgroundColor: 'orange' }]
      }} />
    </div>
  );
};

export default DashboardPorMesAno;