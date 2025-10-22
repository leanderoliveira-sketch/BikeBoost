import React from 'react';

const CLIENT_ID = 'YOUR_STRAVA_CLIENT_ID';
const REDIRECT_URI = 'https://yourbackend.com/api/strava/callback';

const LoginStrava = () => {
  function iniciarLoginStrava() {
    const scopes = 'activity:read,activity:write';
    const url = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&approval_prompt=auto&scope=${scopes}`;
    window.location.href = url;
  }
  return (
    <div>
      <h2>Login com Strava</h2>
      <button onClick={iniciarLoginStrava}>Entrar com Strava</button>
    </div>
  );
};

export default LoginStrava;