import React, { useState } from 'react';

const SyncStrava = () => {
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

  return (
    <div>
      <h2>Sincronizar Treinos do Strava</h2>
      <button onClick={sync}>Sincronizar</button>
      {status && <div>{status}</div>}
      <ul>
        {atividades.map(a => (
          <li key={a.id}>
            {a.name} • {a.distance / 1000} km • {a.moving_time/60} min • {a.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyncStrava;