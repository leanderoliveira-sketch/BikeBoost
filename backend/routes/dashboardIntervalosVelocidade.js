router.get('/dashboard', auth, (req, res) => {
  const user_id = req.user.id;
  let treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);

  // Novos filtros para velocidade média (ex: minVelocidade, maxVelocidade)
  const minVelocidade = req.query.minVelocidade ? parseFloat(req.query.minVelocidade) : null;
  const maxVelocidade = req.query.maxVelocidade ? parseFloat(req.query.maxVelocidade) : null;

  treinos = treinos.filter(t => {
    const d = JSON.parse(t.dias)[0];
    let ok = true;
    if (minVelocidade && parseFloat(d.velocidadeMedia || 0) < minVelocidade) ok = false;
    if (maxVelocidade && parseFloat(d.velocidadeMedia || 0) > maxVelocidade) ok = false;
    return ok;
  });

  // ... demais agregações
  res.json({ treinos /* ... */ });
});