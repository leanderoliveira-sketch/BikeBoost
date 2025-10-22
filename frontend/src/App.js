import React from 'react';
import './App.css';
import GerarTreino from './components/GerarTreino';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>BikeBoost - Gerador de Treinos</h1>
      </header>
      <main>
        <GerarTreino />
      </main>
    </div>
  );
}

export default App;
