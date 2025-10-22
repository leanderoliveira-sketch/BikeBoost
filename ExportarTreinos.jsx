import React from 'react';

const ExportarTreinos = () => {
  function exportarJSON() {
    window.open('/api/treinos/export/json', '_blank');
  }
  function exportarCSV() {
    window.open('/api/treinos/export/csv', '_blank');
  }
  return (
    <div>
      <h2>Exportar Treinos</h2>
      <button onClick={exportarJSON}>Exportar JSON</button>
      <button onClick={exportarCSV}>Exportar CSV</button>
    </div>
  );
};

export default ExportarTreinos;