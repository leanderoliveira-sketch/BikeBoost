router.get('/dashboard', auth, (req, res) => {
  const user_id = req.user.id;
  // Parse multi-select filters
  function parseMulti(key) {
    const val = req.query[key];
    if (!val) return null;
    return Array.isArray(val) ? val : val.split(',');
  }
  const fontes = parseMulti('fontes');
  const tipos = parseMulti('tipos');
  const intensidades = parseMulti('intensidades');
  const semanas = parseMulti('semanas');

  let treinos = db.prepare('SELECT * FROM treinos WHERE user_id = ?').all(user_id);

  if (fontes && fontes.length) treinos = treinos.filter(t => fontes.includes(t.fonte));
  if (tipos && tipos.length) treinos = treinos.filter(t => tipos.includes(JSON.parse(t.dias)[0].tipo));
  if (intensidades && intensidades.length) treinos = treinos.filter(t => intensidades.includes(JSON.parse(t.dias)[0].intensidade));
  if (semanas && semanas.length) treinos = treinos.filter(t => semanas.includes(String(t.semana)));

  // Retorne opções para o frontend
  const fontesAll = [...new Set(db.prepare('SELECT fonte FROM treinos WHERE user_id = ?').all(user_id).map(t => t.fonte))];
  const tiposAll = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.tipo) : [])))];
  const intensidadesAll = [...new Set(treinos.flatMap(t => (t.dias ? JSON.parse(t.dias).map(d => d.intensidade) : [])))];
  const semanasAll = [...new Set(treinos.map(t => t.semana))];

  res.json({
    treinos,
    fontes: fontesAll,
    tipos: tiposAll,
    intensidades: intensidadesAll,
    semanas: semanasAll
  });
});