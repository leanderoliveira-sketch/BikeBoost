import React, { useEffect } from 'react';

const StravaCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      localStorage.setItem('strava_access_token', accessToken);
      window.location.href = '/'; // Redireciona para dashboard/principal
    }
  }, []);
  return <div>Autenticando com Strava...</div>;
};

export default StravaCallback;