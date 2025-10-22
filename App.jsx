// ... imports
import ChatIA from './ChatIA';

const App = () => {
  // estado tela, usuario etc...

  return (
    <div>
      <header>
        {/* ... */}
        {usuario && (
          <div>
            {/* ... outros botões */}
            <button onClick={() => setTela('ia')}>Assistente IA</button>
          </div>
        )}
      </header>
      <main>
        {/* ... outras telas */}
        {usuario && tela === 'ia' && <ChatIA />}
      </main>
    </div>
  );
};