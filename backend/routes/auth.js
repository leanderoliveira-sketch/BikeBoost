const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { criarUsuario, buscarPorEmail } = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'segredo_superseguro';

router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' });
  if (buscarPorEmail(email)) return res.status(400).json({ erro: 'Email já cadastrado' });
  const hash = await bcrypt.hash(senha, 8);
  const id = criarUsuario(nome, email, hash);
  res.json({ sucesso: true, id });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = buscarPorEmail(email);
  if (!user) return res.status(401).json({ erro: 'Usuário não encontrado' });
  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.status(401).json({ erro: 'Senha inválida' });
  const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, nome: user.nome });
});

module.exports = router;