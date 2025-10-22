import React, { useRef, useState } from 'react';

const UploadStrava = ({ accessToken }) => {
  const fileInput = useRef();
  const [status, setStatus] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    setStatus('');
    const file = fileInput.current.files[0];
    if (!file) return setStatus('Selecione um arquivo FIT ou TCX!');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data_type', file.name.endsWith('.fit') ? 'fit' : 'tcx');

    const resp = await fetch('https://www.strava.com/api/v3/uploads', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });
    const data = await resp.json();
    if (data && data.id) setStatus('Upload iniciado! Verifique suas atividades Strava.');
    else setStatus('Erro: ' + (data.error || 'Falha no upload'));
  }

  return (
    <div>
      <h2>Upload direto para Strava</h2>
      <form onSubmit={handleUpload}>
        <input type="file" ref={fileInput} accept=".fit,.tcx" />
        <button type="submit">Enviar para Strava</button>
      </form>
      {status && <div>{status}</div>}
    </div>
  );
};

export default UploadStrava;