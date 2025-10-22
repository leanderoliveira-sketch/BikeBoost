import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const DashboardGraficoComFiltros = () => {
  const [fonte, setFonte] = useState('');
  const [dados, setDados] = useState({ fontes: [], treinos: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = fonte ? `/api/dashboard?fonte=${fonte}` : '/api/dashboard';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, [fonte]);

  const semanas = [...new Set(dados.treinos.map(t => t.semana))];
  const horasPorSemana = semanas.map(sem =>
    dados.treinos.filter(t => t.semana === sem)
      .reduce((soma, t) => soma + (t.dias ? JSON.parse(t.dias).reduce((a, d) => a + parseFloat(d.duracao), 0) : 0), 0)
  );

  return (
    <div>
      <h2>Dashboard Gráfico com Filtros</h2>
      <label>Fonte:</label>
      <select value={fonte} onChange={e => setFonte(e.target.value)}>
        <option value="">Todas</option>
        {dados.fontes.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <Line data={{
        labels: semanas,
        datasets: [{ label: 'Horas/Semana', data: horasPorSemana, borderColor: 'blue' }]
      }} />
    </div>
  );
};

export default DashboardGraficoComFiltros;