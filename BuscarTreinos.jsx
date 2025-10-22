import React, { useState } from 'react';

const BuscarTreinos = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState('');

  async function buscar() {
    setErro('');
    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`/api/treinos?busca=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error('Erro');
      const data = await resp.json();
      setResultados(data);
    } catch {
      setErro('Erro ao buscar treinos.');
    }
  }

  return (
    <div>
      <h2>Buscar Treinos</h2>
      <input
        placeholder="Buscar por objetivo, tipo, semana..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={buscar}>Buscar</button>
      {erro && <div>{erro}</div>}
      <ul>
        {resultados.map(t => (
          <li key={t.id}>
            {t.semana} • {t.ciclo} • {t.objetivo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscarTreinos;