import React, { useEffect, useState } from 'react';

const MeusTreinos = () => {
  const [treinos, setTreinos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchTreinos() {
      setErro('');
      try {
        const token = localStorage.getItem('token');
        const resp = await fetch('/api/treinos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error('Não autorizado');
        const data = await resp.json();
        setTreinos(data);
      } catch (err) {
        setErro('Erro ao carregar treinos ou não autenticado.');
      }
    }
    fetchTreinos();
  }, []);

  return (
    <div>
      <h2>Meus Treinos</h2>
      {erro && <div>{erro}</div>}
      <ul>
        {treinos.map((t, idx) => (
          <li key={t.id || idx}>
            <strong>Ciclo:</strong> {t.ciclo} | <strong>Semana:</strong> {t.semana} | <strong>Objetivo:</strong> {t.objetivo}
            <ul>
              {t.dias.map((dia, i) => (
                <li key={i}>{dia.dia} - {dia.tipo} - {dia.duracao}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeusTreinos;