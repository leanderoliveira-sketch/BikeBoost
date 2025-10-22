import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardFiltrosCombinados = () => {
  const [filtros, setFiltros] = useState({ fonte: '', tipo: '', intensidade: '', semana: '' });
  const [dados, setDados] = useState({ treinos: [], fontes: [], tipos: [], intensidades: [], semanas: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = Object.entries(filtros)
      .filter(([k, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    const url = params ? `/api/dashboard?${params}` : '/api/dashboard';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, [filtros]);

  // Agrega horas por semana
  const semanas = [...new Set(dados.treinos.map(t => t.semana))];
  const horasPorSemana = semanas.map(sem =>
    dados.treinos.filter(t => t.semana === sem)
      .reduce((soma, t) => soma + (t.dias ? JSON.parse(t.dias).reduce((a, d) => a + parseFloat(d.duracao), 0) : 0), 0)
  );

  return (
    <div>
      <h2>Dashboard com Filtros Avançados</h2>
      <div>
        <label>Fonte:</label>
        <select value={filtros.fonte} onChange={e => setFiltros(f => ({ ...f, fonte: e.target.value }))}>
          <option value="">Todas</option>
          {dados.fontes.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <label>Tipo:</label>
        <select value={filtros.tipo} onChange={e => setFiltros(f => ({ ...f, tipo: e.target.value }))}>
          <option value="">Todos</option>
          {dados.tipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <label>Intensidade:</label>
        <select value={filtros.intensidade} onChange={e => setFiltros(f => ({ ...f, intensidade: e.target.value }))}>
          <option value="">Todas</option>
          {dados.intensidades.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <label>Semana:</label>
        <select value={filtros.semana} onChange={e => setFiltros(f => ({ ...f, semana: e.target.value }))}>
          <option value="">Todas</option>
          {dados.semanas.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Line data={{
        labels: semanas,
        datasets: [{ label: 'Horas/Semana', data: horasPorSemana, borderColor: 'blue' }]
      }} />
      <Bar data={{
        labels: dados.tipos,
        datasets: [{
          label: 'Treinos por Tipo',
          data: dados.tipos.map(tipo =>
            dados.treinos.flatMap(t => (t.dias ? JSON.parse(t.dias) : [])).filter(d => d.tipo === tipo).length
          ),
          backgroundColor: 'orange'
        }]
      }} />
      <ul>
        {dados.treinos.map(t => (
          <li key={t.id}>
            {t.objetivo} • Fonte: {t.fonte} • Tipo: {JSON.parse(t.dias)[0].tipo} • Intensidade: {JSON.parse(t.dias)[0].intensidade} • Semana: {t.semana}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardFiltrosCombinados;