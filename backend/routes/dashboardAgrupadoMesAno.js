router.get('/dashboard/agregado', auth, (req, res) => {
  const user_id = req.user.id;
  const treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);

  // Agrupamento por mês/ano
  const grupos = {};
  treinos.forEach(t => {
    const d = JSON.parse(t.dias)[0];
    const dt = new Date(d.dia);
    const chave = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2, '0')}`;
    if (!grupos[chave]) grupos[chave] = { totalHoras: 0, totalDistancia: 0, qtd: 0 };
    grupos[chave].totalHoras += parseFloat(d.duracao || 0);
    grupos[chave].totalDistancia += parseFloat(d.distancia || 0);
    grupos[chave].qtd += 1;
  });

  const labels = Object.keys(grupos).sort();
  const totalHoras = labels.map(l => grupos[l].totalHoras);
  const totalDistancia = labels.map(l => grupos[l].totalDistancia);
  const qtdTreinos = labels.map(l => grupos[l].qtd);

  res.json({ labels, totalHoras, totalDistancia, qtdTreinos });
});