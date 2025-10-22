import React, { useEffect, useState } from 'react';

const NotificacoesPush = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    // Simulação: polling a cada 10 segundos
    const token = localStorage.getItem('token');
    const interval = setInterval(async () => {
      const resp = await fetch('/api/notificacoes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setNotificacoes(data.filter(n => !n.lida));
        // Exibe notificação web
        data.filter(n => !n.lida).forEach(n => {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Nova notificação", { body: n.texto });
          }
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Solicita permissão ao entrar no app
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div>
      <h2>Notificações Web</h2>
      <ul>
        {notificacoes.map(n => (
          <li key={n.id}>{n.texto}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificacoesPush;