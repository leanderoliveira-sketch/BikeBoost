import React, { useState } from 'react';

const Cadastro = ({ onCadastro }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem('');
    try {
      const resp = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const data = await resp.json();
      if (data.sucesso) {
        setMensagem('Cadastro realizado! Faça login.');
        setNome(''); setEmail(''); setSenha('');
        onCadastro && onCadastro();
      } else {
        setMensagem(data.erro || 'Erro no cadastro');
      }
    } catch {
      setMensagem('Erro ao conectar');
    }
  }

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <div>{mensagem}</div>}
    </div>
  );
};

export default Cadastro;