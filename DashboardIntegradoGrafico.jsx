import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardIntegradoGrafico = () => {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, []);

  if (!dados) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Dashboard Integrado</h2>
      <Line data={{
        labels: dados.semanas,
        datasets: [{ label: 'Horas por semana', data: dados.horasPorSemana, borderColor: 'blue' }]
      }} />
      <Bar data={{
        labels: dados.tipos,
        datasets: [{ label: 'Treinos por tipo', data: dados.qtdPorTipo, backgroundColor: 'orange' }]
      }} />
      <div>
        <strong>Total de Treinos:</strong> {dados.totalTreinos}<br/>
        <strong>Total de Horas:</strong> {dados.totalHoras}<br/>
        <strong>Intensidade média:</strong> {dados.intensidadeMedia.toFixed(2)}
      </div>
    </div>
  );
};

export default DashboardIntegradoGrafico;