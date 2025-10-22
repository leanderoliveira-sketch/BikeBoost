import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Line, Bar } from 'react-chartjs-2';

const DashboardIntervalosMultiSelect = () => {
  const [filtros, setFiltros] = useState({
    fontes: [],
    tipos: [],
    intensidades: [],
    semanas: [],
    minDuracao: '',
    maxDuracao: '',
    minDistancia: '',
    maxDistancia: '',
    minData: '',
    maxData: ''
  });
  const [dados, setDados] = useState({ treinos: [], tipos: [], intensidades: [], semanas: [], fontes: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = Object.entries(filtros)
      .filter(([k, v]) => Array.isArray(v) ? v.length : v)
      .map(([k, v]) =>
        Array.isArray(v) ? `${k}=${v.map(encodeURIComponent).join(',')}` : `${k}=${encodeURIComponent(v)}`
      )
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
      <h2>Dashboard com Filtros Avançados e Intervalos</h2>
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
      <div>
        <label>Min duração (min):</label>
        <input type="number" value={filtros.minDuracao} onChange={e => setFiltros(f => ({ ...f, minDuracao: e.target.value }))} />
        <label>Max duração (min):</label>
        <input type="number" value={filtros.maxDuracao} onChange={e => setFiltros(f => ({ ...f, maxDuracao: e.target.value }))} />
      </div>
      <div>
        <label>Min distância (km):</label>
        <input type="number" value={filtros.minDistancia} onChange={e => setFiltros(f => ({ ...f, minDistancia: e.target.value }))} />
        <label>Max distância (km):</label>
        <input type="number" value={filtros.maxDistancia} onChange={e => setFiltros(f => ({ ...f, maxDistancia: e.target.value }))} />
      </div>
      <div>
        <label>Data inicial:</label>
        <input type="date" value={filtros.minData} onChange={e => setFiltros(f => ({ ...f, minData: e.target.value }))} />
        <label>Data final:</label>
        <input type="date" value={filtros.maxData} onChange={e => setFiltros(f => ({ ...f, maxData: e.target.value }))} />
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

export default DashboardIntervalosMultiSelect;