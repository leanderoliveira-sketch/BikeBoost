import React from 'react';
import { Line } from 'react-chartjs-2';

const GraficoEvolucao = ({ treinos }) => {
  const data = {
    labels: treinos.map(t => `Semana ${t.semana}`),
    datasets: [
      {
        label: 'Tempo total (min)',
        data: treinos.map(t =>
          t.dias.reduce((ac, d) => ac + parseInt(d.duracao), 0)
        ),
        borderColor: 'blue',
        tension: 0.4,
      }
    ]
  };
  return (
    <div>
      <h2>Gráfico de Evolução</h2>
      <Line data={data} />
    </div>
  );
};

export default GraficoEvolucao;