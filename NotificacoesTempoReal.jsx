import React, { useEffect, useState } from 'react';

const NotificacoesTempoReal = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let interval = setInterval(async () => {
      const resp = await fetch('/api/notificacoes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setNotificacoes(data);
      }
    }, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Notificações em tempo real</h2>
      <ul>
        {notificacoes.map(n => (
          <li key={n.id}>{n.texto}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificacoesTempoReal;