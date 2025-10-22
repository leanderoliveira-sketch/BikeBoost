import React, { useState } from 'react';
import './GerarTreino.css';

const GerarTreino = () => {
  const [objetivo, setObjetivo] = useState('Geral');
  const [semana, setSemana] = useState(1);
  const [loading, setLoading] = useState(false);
  const [treinoData, setTreinoData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/treino', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo,
          semana: parseInt(semana),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar treino');
      }

      const data = await response.json();
      setTreinoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="gerar-treino-container">
      <div className="form-section">
        <h2>Gerar Planilha Semanal de Treino</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="objetivo">Objetivo:</label>
            <select
              id="objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="form-control"
            >
              <option value="Geral">Geral</option>
              <option value="Competição">Competição</option>
              <option value="Específico">Específico</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semana">Semana do Ciclo:</label>
            <input
              type="number"
              id="semana"
              min="1"
              max="52"
              value={semana}
              onChange={(e) => setSemana(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Gerando...' : 'Gerar Treino'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {treinoData && (
        <div className="treino-result">
          <div className="treino-header">
            <h3>Planilha Semanal</h3>
            <div className="treino-info">
              <div className="info-item">
                <strong>Ciclo:</strong> {treinoData.ciclo}
              </div>
              <div className="info-item">
                <strong>Semana:</strong> {treinoData.semana}
              </div>
              <div className="info-item">
                <strong>Nível:</strong> {treinoData.nivel}
              </div>
              <div className="info-item">
                <strong>Objetivo:</strong> {treinoData.objetivo}
              </div>
            </div>
          </div>

          <div className="treino-table-container">
            <table className="treino-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Duração</th>
                  <th>Intensidade</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {treinoData.dias && treinoData.dias.map((dia, index) => (
                  <tr key={index}>
                    <td>{dia.dia}</td>
                    <td>{formatDate(dia.data)}</td>
                    <td>{dia.tipo}</td>
                    <td>{dia.duracao}</td>
                    <td>{dia.intensidade}</td>
                    <td className="observacao-cell">{dia.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerarTreino;
