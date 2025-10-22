import React, { useState } from 'react';
import Cadastro from './Cadastro';
import Login from './Login';
import MeusTreinos from './MeusTreinos';
import GerarTreino from './GerarTreino'; // Seu componente de geração de treino

const App = () => {
  const [tela, setTela] = useState('login'); // 'login', 'cadastro', 'treinos', 'gerar'
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || '');

  // Ao logar, salva nome e mostra treinos
  function handleLogin(nome) {
    setUsuario(nome);
    localStorage.setItem('usuario', nome);
    setTela('treinos');
  }

  // Ao cadastrar, volta para login
  function handleCadastro() {
    setTela('login');
  }

  // Logout
  function handleLogout() {
    setUsuario('');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setTela('login');
  }

  return (
    <div>
      <header>
        <h1>BikeBoost</h1>
        {usuario && (
          <div>
            Olá, {usuario}! <button onClick={handleLogout}>Sair</button>
            <button onClick={() => setTela('gerar')}>Gerar Treino</button>
            <button onClick={() => setTela('treinos')}>Meus Treinos</button>
          </div>
        )}
      </header>

      <main>
        {!usuario && tela === 'login' && (
          <>
            <Login onLogin={handleLogin} />
            <p>
              Não tem conta? <button onClick={() => setTela('cadastro')}>Cadastre-se</button>
            </p>
          </>
        )}
        {!usuario && tela === 'cadastro' && (
          <>
            <Cadastro onCadastro={handleCadastro} />
            <p>
              Já tem conta? <button onClick={() => setTela('login')}>Fazer login</button>
            </p>
          </>
        )}
        {usuario && tela === 'treinos' && <MeusTreinos />}
        {usuario && tela === 'gerar' && <GerarTreino />}
      </main>
    </div>
  );
};

export default App;