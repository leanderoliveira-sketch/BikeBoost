import React, { useState, useEffect } from 'react';

const Perfil = () => {
  const [perfil, setPerfil] = useState({ nome: '', email: '' });
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function fetchPerfil() {
      const token = localStorage.getItem('token');
      const resp = await fetch('/api/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setPerfil(data);
        setNovoNome(data.nome);
      }
    }
    fetchPerfil();
  }, []);

  async function salvar() {
    setMensagem('');
    const token = localStorage.getItem('token');
    const resp = await fetch('/api/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: novoNome })
    });
    if (resp.ok) {
      setPerfil({ ...perfil, nome: novoNome });
      setEditando(false);
      setMensagem('Salvo!');
    } else {
      setMensagem('Erro ao salvar.');
    }
  }

  return (
    <div>
      <h2>Meu Perfil</h2>
      <div>Email: {perfil.email}</div>
      <div>
        Nome: {editando ? (
          <input value={novoNome} onChange={e => setNovoNome(e.target.value)} />
        ) : (
          perfil.nome
        )}
        <button onClick={() => setEditando(!editando)}>{editando ? 'Cancelar' : 'Editar'}</button>
        {editando && <button onClick={salvar}>Salvar</button>}
      </div>
      {mensagem && <div>{mensagem}</div>}
    </div>
  );
};

export default Perfil;