import React from 'react';
import LoginServicos from './LoginServicos';
import StravaCallback from './StravaCallback';
import GoogleFitCallback from './GoogleFitCallback';

const App = () => {
  // ... seu controle de rotas/tela
  // Exemplo com react-router-dom
  return (
    <Routes>
      <Route path="/" element={<LoginServicos />} />
      <Route path="/strava-callback" element={<StravaCallback />} />
      <Route path="/googlefit-callback" element={<GoogleFitCallback />} />
      {/* ... outras rotas */}
    </Routes>
  );
};

export default App;