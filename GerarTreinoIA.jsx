import React, { useState } from 'react';

const niveis = ['Iniciante', 'Intermediário', 'Avançado'];
const objetivos = ['Geral', 'Competição', 'Específico'];

const GerarTreinoIA = ({ onTreinoGerado }) => {
  const [nivel, setNivel] = useState(niveis[0]);
  const [objetivo, setObjetivo] = useState(objetivos[0]);
  const [semana, setSemana] = useState(1);
  const [loading, setLoading] = useState(false);
  const [treino, setTreino] = useState('');
  const [erro, setErro] = useState('');

  async function gerarTreino() {
    setLoading(true); setErro('');
    const prompt = `
      Gere uma planilha semanal de treino de ciclismo em JSON para:
      Objetivo: ${objetivo}
      Semana: ${semana}
      Nível: ${nivel}
      Inclua dias, tipo, duração (em horas), intensidade, observação.
    `;
    try {
      const resp = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await resp.json();
      let treinoObj = null;
      try {
        treinoObj = typeof data.resposta === 'string' ? JSON.parse(data.resposta) : data.resposta;
        setTreino(JSON.stringify(treinoObj, null, 2));
        onTreinoGerado && onTreinoGerado(treinoObj);
      } catch {
        setTreino(data.resposta);
        setErro('Não foi possível converter a resposta da IA para JSON.');
      }
    } catch (e) {
      setErro('Erro ao conectar à IA');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Gerar Treino Automático (IA)</h2>
      <div>
        <label>Nível:</label>
        <select value={nivel} onChange={e => setNivel(e.target.value)}>
          {niveis.map(n => <option key={n}>{n}</option>)}
        </select>
        <label>Objetivo:</label>
        <select value={objetivo} onChange={e => setObjetivo(e.target.value)}>
          {objetivos.map(o => <option key={o}>{o}</option>)}
        </select>
        <label>Semana:</label>
        <input type="number" min={1} max={52} value={semana} onChange={e => setSemana(+e.target.value)} />
        <button onClick={gerarTreino} disabled={loading}>{loading ? 'Gerando...' : 'Gerar Treino'}</button>
      </div>
      {erro && <div style={{color:'red'}}>{erro}</div>}
      {treino && (
        <pre>
          {treino}
        </pre>
      )}
    </div>
  );
};

export default GerarTreinoIA;