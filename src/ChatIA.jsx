import React, { useState } from 'react';

const ChatIA = () => {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  async function enviarPergunta(e) {
    e.preventDefault();
    setLoading(true);
    setResposta('');
    try {
      const resp = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: mensagem })
      });
      const data = await resp.json();
      setResposta(data.resposta || 'Sem resposta');
    } catch {
      setResposta('Erro ao conectar à IA');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Assistente IA (HuggingFace)</h2>
      <form onSubmit={enviarPergunta}>
        <input
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          placeholder="Digite sua dúvida ou peça um treino"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Perguntando...' : 'Perguntar'}
        </button>
      </form>
      {resposta && <div className="resposta-ia">{resposta}</div>}
    </div>
  );
};

export default ChatIA;