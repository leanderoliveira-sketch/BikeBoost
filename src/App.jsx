import React, { useState } from 'react';
import Cadastro from './Cadastro';
import Login from './Login';
import ChatIA from './ChatIA';
import MeusTreinos from './MeusTreinos';
import GerarTreino from './GerarTreino';
import GraficoEvolucao from './GraficoEvolucao';
import ExportarGarmin from './ExportarGarmin';

const App = () => {
  const [tela, setTela] = useState('login'); // login, cadastro, treinos, gerar, ia, grafico
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || '');
  const [treinoSelecionado, setTreinoSelecionado] = useState(null); // Para exportação ou gráficos

  function handleLogin(nome) {
    setUsuario(nome);
    localStorage.setItem('usuario', nome);
    setTela('treinos');
  }

  function handleCadastro() {
    setTela('login');
  }

  function handleLogout() {
    setUsuario('');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setTela('login');
  }

  // Renderiza lista de treinos e permite selecionar para exportar ou ver gráfico
  function renderMeusTreinos() {
    return (
      <MeusTreinos
        onSelectTreino={treino => {
          setTreinoSelecionado(treino);
          setTela('grafico');
        }}
        onExportTreino={treino => {
          setTreinoSelecionado(treino);
          setTela('exportar');
        }}
      />
    );
  }

  // Para navegação, pode exibir botões no header
  return (
    <div>
      <header>
        <h1>BikeBoost</h1>
        {usuario && (
          <div>
            Olá, {usuario}! <button onClick={handleLogout}>Sair</button>
            <button onClick={() => setTela('gerar')}>Gerar Treino</button>
            <button onClick={() => setTela('treinos')}>Meus Treinos</button>
            <button onClick={() => setTela('ia')}>Assistente IA</button>
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
        {usuario && tela === 'treinos' && renderMeusTreinos()}
        {usuario && tela === 'gerar' && <GerarTreino />}
        {usuario && tela === 'ia' && <ChatIA />}
        {usuario && tela === 'grafico' && treinoSelecionado && (
          <GraficoEvolucao treinos={[treinoSelecionado]} />
        )}
        {usuario && tela === 'exportar' && treinoSelecionado && (
          <ExportarGarmin treinoId={treinoSelecionado.id} />
        )}
      </main>
    </div>
  );
};

export default App;