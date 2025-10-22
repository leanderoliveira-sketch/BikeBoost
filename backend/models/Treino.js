const db = require('../db');

function salvarTreino(user_id, treino) {
  const stmt = db.prepare(`
    INSERT INTO treinos (user_id, ciclo, semana, nivel, objetivo, dias)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(user_id, treino.ciclo, treino.semana, treino.nivel, treino.objetivo, JSON.stringify(treino.dias));
}

function listarTreinosPorUsuario(user_id) {
  const stmt = db.prepare('SELECT * FROM treinos WHERE user_id = ? ORDER BY criado_em DESC');
  const treinos = stmt.all(user_id);
  return treinos.map(t => ({
    ...t,
    dias: JSON.parse(t.dias)
  }));
}

module.exports = { salvarTreino, listarTreinosPorUsuario };