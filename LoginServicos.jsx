import React from 'react';

const STRAVA_CLIENT_ID = 'YOUR_STRAVA_CLIENT_ID';
const STRAVA_REDIRECT_URI = 'https://seuapp.com/strava-callback';
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLEFIT_REDIRECT_URI = 'https://seuapp.com/googlefit-callback';
const GOOGLEFIT_SCOPE = 'https://www.googleapis.com/auth/fitness.activity.read';

export const iniciarLoginStrava = () => {
  const scopes = 'activity:read,activity:write';
  const url = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&approval_prompt=auto&scope=${scopes}`;
  window.location.href = url;
};

export const iniciarLoginGoogleFit = () => {
  const url = [
    'https://accounts.google.com/o/oauth2/v2/auth',
    `?client_id=${GOOGLE_CLIENT_ID}`,
    `&redirect_uri=${encodeURIComponent(GOOGLEFIT_REDIRECT_URI)}`,
    '&response_type=code',
    `&scope=${encodeURIComponent(GOOGLEFIT_SCOPE)}`,
    '&access_type=offline'
  ].join('');
  window.location.href = url;
};

const LoginServicos = () => (
  <div>
    <h2>Login com Serviços de Treino</h2>
    <button onClick={iniciarLoginStrava}>Entrar com Strava</button>
    <button onClick={iniciarLoginGoogleFit}>Entrar com Google Fit</button>
  </div>
);

export default LoginServicos;