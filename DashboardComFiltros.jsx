import React, { useEffect, useState } from 'react';

const DashboardComFiltros = () => {
  const [fonte, setFonte] = useState('');
  const [dados, setDados] = useState({ fontes: [], treinos: [] });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = fonte ? `/api/dashboard?fonte=${fonte}` : '/api/dashboard';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setDados);
  }, [fonte]);

  // Exemplo de agregação por semana
  const semanas = [...new Set(dados.treinos.map(t => t.semana))];
  const horasPorSemana = semanas.map(sem =>
    dados.treinos.filter(t => t.semana === sem)
      .reduce((soma, t) => soma + (t.dias ? JSON.parse(t.dias).reduce((a, d) => a + parseFloat(d.duracao), 0) : 0), 0)
  );

  return (
    <div>
      <h2>Dashboard com Filtros por Fonte</h2>
      <label>Fonte:</label>
      <select value={fonte} onChange={e => setFonte(e.target.value)}>
        <option value="">Todas</option>
        {dados.fontes.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <ul>
        {dados.treinos.map(t => (
          <li key={t.id}>{t.objetivo} • Fonte: {t.fonte} • Semana {t.semana}</li>
        ))}
      </ul>
      <div>
        <strong>Horas por semana:</strong> {horasPorSemana.join(', ')}
      </div>
    </div>
  );
};

export default DashboardComFiltros;