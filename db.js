const Database = require('better-sqlite3');
const db = new Database('database.db');

// Cria tabelas se não existirem
db.prepare(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS treinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  objetivo TEXT,
  semana INTEGER,
  dias TEXT
)`).run();

module.exports = db;