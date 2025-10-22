const Database = require('better-sqlite3');
const db = new Database('bikeboost.sqlite');

// Criação das tabelas se não existirem
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS treinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ciclo TEXT,
  semana INTEGER,
  nivel TEXT,
  objetivo TEXT,
  dias TEXT, -- JSON string
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

module.exports = db;