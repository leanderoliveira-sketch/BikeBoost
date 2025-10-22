const db = require('../db');

function criarUsuario(nome, email, senhaHash) {
  const stmt = db.prepare('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)');
  const info = stmt.run(nome, email, senhaHash);
  return info.lastInsertRowid;
}

function buscarPorEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

function buscarPorId(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

module.exports = { criarUsuario, buscarPorEmail, buscarPorId };