import React from 'react';

const ExportarGarmin = ({ treinoId }) => {
  function exportar() {
    window.open(`/api/treino/${treinoId}/exportar`, '_blank');
  }

  return <button onClick={exportar}>Exportar para Garmin (TCX)</button>;
};

export default ExportarGarmin;