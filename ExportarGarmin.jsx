import React from 'react';

const ExportarGarmin = ({ treinoId }) => {
  function baixarTCX() {
    window.open(`/api/treino/${treinoId}/export/tcx`, '_blank');
  }
  function baixarFIT() {
    window.open(`/api/treino/${treinoId}/export/fit`, '_blank');
  }
  return (
    <div>
      <h2>Exportar para Garmin Connect</h2>
      <button onClick={baixarTCX}>Baixar TCX</button>
      <button onClick={baixarFIT}>Baixar FIT</button>
      <p>Após baixar, acesse <a href="https://connect.garmin.com/modern/import-data" target="_blank" rel="noopener">Garmin Connect</a> para importar.</p>
    </div>
  );
};

export default ExportarGarmin;