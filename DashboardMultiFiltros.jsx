import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Line, Bar } from 'react-chartjs-2';

const DashboardMultiFiltros = () => {
  const [filtros, setFiltros] = useState({ fontes: [], tipos: [], intensidades: [], semanas: [] });
  const [dados, setDados] = useState({ treinos: [], fontes: [], tipos: [], intensidades: [], semanas: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = Object.entries(filtros)
      .filter(([k, v]) => v.length)
      .map(([k, v]) => `${k}=${v.map(encodeURIComponent).join(',')}`)
      .join('&');
    const url = params ? `/api/dashboard?${params}` : '/api/dashboard';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, [filtros]);

  // Agregação por semana (exemplo)
  const semanas = [...new Set(dados.treinos.map(t => t.semana))];
  const horasPorSemana = semanas.map(sem =>
    dados.treinos.filter(t => t.semana === sem)
      .reduce((soma, t) => soma + (t.dias ? JSON.parse(t.dias).reduce((a, d) => a + parseFloat(d.duracao), 0) : 0), 0)
  );

  return (
    <div>
      <h2>Dashboard Multi-Filtros</h2>
      <Select
        isMulti
        options={dados.fontes.map(f => ({ value: f, label: f }))}
        placeholder="Fontes"
        onChange={opts => setFiltros(f => ({ ...f, fontes: opts.map(o => o.value) }))}
      />
      <Select
        isMulti
        options={dados.tipos.map(t => ({ value: t, label: t }))}
        placeholder="Tipos"
        onChange={opts => setFiltros(f => ({ ...f, tipos: opts.map(o => o.value) }))}
      />
      <Select
        isMulti
        options={dados.intensidades.map(i => ({ value: i, label: i }))}
        placeholder="Intensidades"
        onChange={opts => setFiltros(f => ({ ...f, intensidades: opts.map(o => o.value) }))}
      />
      <Select
        isMulti
        options={dados.semanas.map(s => ({ value: s, label: `Semana ${s}` }))}
        placeholder="Semanas"
        onChange={opts => setFiltros(f => ({ ...f, semanas: opts.map(o => o.value) }))}
      />
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

export default DashboardMultiFiltros;