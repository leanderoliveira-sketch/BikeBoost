import React from 'react';

const ExportarTCX = ({ treinoId }) => {
  function exportarTCX() {
    window.open(`/api/treino/${treinoId}/export/tcx`, '_blank');
  }
  return <button onClick={exportarTCX}>Exportar para Garmin (TCX)</button>;
};

export default ExportarTCX;