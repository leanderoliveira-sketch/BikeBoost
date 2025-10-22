import React, { useState } from 'react';

const SyncAndSaveGoogleFit = () => {
  const [atividades, setAtividades] = useState([]);
  const [status, setStatus] = useState('');

  async function sync() {
    setStatus('Sincronizando...');
    const token = localStorage.getItem('googlefit_access_token');
    if (!token) return setStatus('Faça login com Google Fit primeiro!');
    const now = Date.now();
    const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    const body = {
      aggregateBy: [{ dataTypeName: "com.google.activity.segment" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: lastWeek,
      endTimeMillis: now
    };
    const resp = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!resp.ok) return setStatus('Erro na sincronização.');
    const data = await resp.json();
    setAtividades(data.bucket || []);
    setStatus('');
  }

  async function salvarNoBackend() {
    setStatus('Salvando...');
    const userToken = localStorage.getItem('token');
    const treinos = atividades.map(b => ({
      ciclo: 'GoogleFit',
      semana: new Date(Number(b.startTimeMillis)).getWeek ? new Date(Number(b.startTimeMillis)).getWeek() : 1,
      nivel: 'Ciclismo',
      objetivo: 'Sincronizado Google Fit',
      dias: [{
        dia: new Date(Number(b.startTimeMillis)).toLocaleDateString(),
        tipo: 'Ciclismo',
        duracao: b.dataset && b.dataset[0] && b.dataset[0].point.length ? '1' : '0',
        intensidade: 'média'
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
      <h2>Sincronizar e Salvar Treinos do Google Fit</h2>
      <button onClick={sync}>Sincronizar</button>
      <button onClick={salvarNoBackend} disabled={atividades.length === 0}>Salvar no backend</button>
      {status && <div>{status}</div>}
      <ul>
        {atividades.map((b, i) => (
          <li key={i}>
            {b.startTimeMillis && new Date(Number(b.startTimeMillis)).toLocaleDateString()} •
            {b.dataset && b.dataset.length > 0 ? b.dataset[0].point.length : 0} atividades
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyncAndSaveGoogleFit;