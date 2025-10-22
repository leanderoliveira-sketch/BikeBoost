<label>Min velocidade média (km/h):</label>
<input type="number" value={filtros.minVelocidade} onChange={e => setFiltros(f => ({ ...f, minVelocidade: e.target.value }))} />
<label>Max velocidade média (km/h):</label>
<input type="number" value={filtros.maxVelocidade} onChange={e => setFiltros(f => ({ ...f, maxVelocidade: e.target.value }))} />