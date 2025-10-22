const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Apagar banco se existir para testar em estado limpo
const dbFile = path.join(__dirname, '..', 'bikeboost.sqlite');
try { if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile); } catch (e) {}

const app = require('..//app');

describe('API backend', () => {
  let token = null;

  test('cadastro -> login -> criar e listar treinos', async () => {
    const cadastroRes = await request(app)
      .post('/api/cadastro')
      .send({ nome: 'TestUser', email: 'testuser@example.com', senha: 'senha123' })
      .expect(200);

    expect(cadastroRes.body).toHaveProperty('sucesso', true);

    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: 'testuser@example.com', senha: 'senha123' })
      .expect(200);

    expect(loginRes.body).toHaveProperty('token');
    token = loginRes.body.token;

    // criar treino
    const criarRes = await request(app)
      .post('/api/treinos')
      .set('Authorization', `Bearer ${token}`)
      .send({ ciclo: 'Base', semana: 1, nivel: 'amador', objetivo: 'Geral', dias: [{ dia: 'Segunda' }] })
      .expect(200);

    // listar
    const listarRes = await request(app)
      .get('/api/treinos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listarRes.body)).toBe(true);
    expect(listarRes.body.length).toBeGreaterThanOrEqual(1);
  }, 20000);
});
