import React, { useState } from 'react';

const SyncAndSaveStrava = () => {
  const [atividades, setAtividades] = useState([]);
  const [status, setStatus] = useState('');

  async function sync() {
    setStatus('Sincronizando...');
    const token = localStorage.getItem('strava_access_token');
    if (!token) return setStatus('Faça login com Strava primeiro!');
    const resp = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) return setStatus('Erro na sincronização.');
    const data = await resp.json();
    setAtividades(data);
    setStatus('');
  }

  async function salvarNoBackend() {
    setStatus('Salvando...');
    const userToken = localStorage.getItem('token');
    const treinos = atividades.map(a => ({
      ciclo: 'Strava',
      semana: new Date(a.start_date).getWeek ? new Date(a.start_date).getWeek() : 1,
      nivel: a.type,
      objetivo: a.name,
      dias: [{
        dia: new Date(a.start_date).toLocaleDateString(),
        tipo: a.type,
        duracao: (a.moving_time / 60).toFixed(1),
        intensidade: a.average_speed > 5 ? 'alta' : 'média'
      }]
    }));
    const resp = await fetch('/api/treinos/import/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ treinos }),
    });
    if (resp.ok) setStatus('Treinos salvos no backend!');
    else setStatus('Erro ao salvar treinos.');
  }

  return (
    <div>
      <h2>Sincronizar e Salvar Treinos do Strava</h2>
      <button onClick={sync}>Sincronizar</button>
      <button onClick={salvarNoBackend} disabled={atividades.length === 0}>Salvar no backend</button>
      {status && <div>{status}</div>}
      <ul>
        {atividades.map(a => (
          <li key={a.id}>
            {a.name} • {a.distance / 1000} km • {a.moving_time / 60} min • {a.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyncAndSaveStrava;