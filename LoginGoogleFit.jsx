import React from 'react';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const REDIRECT_URI = 'https://yourbackend.com/api/googlefit/callback';
const SCOPE = 'https://www.googleapis.com/auth/fitness.activity.read';

const LoginGoogleFit = () => {
  function iniciarLoginGoogleFit() {
    const url = [
      'https://accounts.google.com/o/oauth2/v2/auth',
      `?client_id=${CLIENT_ID}`,
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
      '&response_type=code',
      `&scope=${encodeURIComponent(SCOPE)}`,
      '&access_type=offline'
    ].join('');
    window.location.href = url;
  }
  return (
    <div>
      <h2>Login com Google Fit</h2>
      <button onClick={iniciarLoginGoogleFit}>Entrar com Google Fit</button>
    </div>
  );
};

export default LoginGoogleFit;