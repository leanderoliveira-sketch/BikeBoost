import React, { useEffect } from 'react';

const GoogleFitCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      localStorage.setItem('googlefit_access_token', accessToken);
      window.location.href = '/'; // Redireciona para dashboard/principal
    }
  }, []);
  return <div>Autenticando com Google Fit...</div>;
};

export default GoogleFitCallback;