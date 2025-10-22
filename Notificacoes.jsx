import React, { useState, useEffect } from 'react';

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    // Simulação: poderia buscar do backend
    setNotificacoes([
      { id: 1, texto: 'Treino gerado com sucesso!', lida: false },
      { id: 2, texto: 'Nova semana disponível!', lida: false }
    ]);
  }, []);

  function marcarComoLida(id) {
    setNotificacoes(nots => nots.map(n => n.id === id ? { ...n, lida: true } : n));
  }

  return (
    <div>
      <h2>Notificações</h2>
      <ul>
        {notificacoes.map(n => (
          <li key={n.id} style={{opacity: n.lida ? 0.5 : 1}}>
            {n.texto}
            {!n.lida && <button onClick={() => marcarComoLida(n.id)}>Marcar como lida</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notificacoes;