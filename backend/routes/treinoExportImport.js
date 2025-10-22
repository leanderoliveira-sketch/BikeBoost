router.post('/treinos/import/json', auth, (req, res) => {
  const { treinos } = req.body;
  if (!Array.isArray(treinos)) return res.status(400).json({ erro: 'Formato inválido' });
  treinos.forEach(t => {
    db.prepare('INSERT INTO treinos (user_id, ciclo, semana, nivel, objetivo, dias) VALUES (?, ?, ?, ?, ?, ?)')
      .run(req.user.id, t.ciclo, t.semana, t.nivel, t.objetivo, JSON.stringify(t.dias));
  });
  res.json({ sucesso: true });
});