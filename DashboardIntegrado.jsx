import React, { useEffect, useState } from 'react';

const DashboardIntegrado = () => {
  const [local, setLocal] = useState([]);
  const [strava, setStrava] = useState([]);
  const [google, setGoogle] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/treinos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setLocal);

    const stravaToken = localStorage.getItem('strava_access_token');
    if (stravaToken) {
      fetch('https://www.strava.com/api/v3/athlete/activities?per_page=5', {
        headers: { Authorization: `Bearer ${stravaToken}` }
      })
        .then(r => r.json())
        .then(setStrava);
    }
    const googleToken = localStorage.getItem('googlefit_access_token');
    if (googleToken) {
      const now = Date.now();
      const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
      const body = {
        aggregateBy: [{ dataTypeName: "com.google.activity.segment" }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: lastWeek,
        endTimeMillis: now
      };
      fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${googleToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(r => r.json())
        .then(d => setGoogle(d.bucket || []));
    }
  }, []);

  return (
    <div>
      <h2>Dashboard Integrado</h2>
      <h3>Treinos locais</h3>
      <ul>{local.map(t => <li key={t.id}>{t.objetivo} • Semana {t.semana}</li>)}</ul>
      <h3>Treinos Strava</h3>
      <ul>{strava.map(a => <li key={a.id}>{a.name} • {a.distance / 1000} km</li>)}</ul>
      <h3>Treinos Google Fit</h3>
      <ul>{google.map((b, i) => (
        <li key={i}>{b.startTimeMillis && new Date(Number(b.startTimeMillis)).toLocaleDateString()} • {b.dataset && b.dataset.length > 0 ? b.dataset[0].point.length : 0} atividades</li>
      ))}</ul>
    </div>
  );
};

export default DashboardIntegrado;