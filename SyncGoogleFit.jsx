import React, { useState } from 'react';

const SyncGoogleFit = () => {
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

  return (
    <div>
      <h2>Sincronizar Treinos do Google Fit</h2>
      <button onClick={sync}>Sincronizar</button>
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

export default SyncGoogleFit;