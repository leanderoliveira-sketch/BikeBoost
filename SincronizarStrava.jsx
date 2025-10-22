const SincronizarStrava = () => {
  function iniciarSincronizacao() {
    window.location.href = 'https://www.strava.com/oauth/authorize?...'; // Redirecione para OAuth Strava
  }
  return <button onClick={iniciarSincronizacao}>Sincronizar com Strava</button>;
};
export default SincronizarStrava;