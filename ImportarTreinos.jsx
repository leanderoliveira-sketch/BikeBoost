import React, { useRef, useState } from 'react';

const ImportarTreinos = () => {
  const fileRef = useRef();
  const [status, setStatus] = useState('');
  async function importar(event) {
    event.preventDefault();
    const file = fileRef.current.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const treinos = JSON.parse(text);
      const token = localStorage.getItem('token');
      const resp = await fetch('/api/treinos/import/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ treinos }),
      });
      if (resp.ok) setStatus('Importado!');
      else setStatus('Erro ao importar');
    } catch {
      setStatus('Arquivo inválido!');
    }
  }
  return (
    <div>
      <h2>Importar Treinos (JSON)</h2>
      <form onSubmit={importar}>
        <input type="file" ref={fileRef} accept=".json" />
        <button type="submit">Importar</button>
      </form>
      {status && <div>{status}</div>}
    </div>
  );
};

export default ImportarTreinos;