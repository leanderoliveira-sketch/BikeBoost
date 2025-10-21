# BikeBoost — MVP de app de treinos de ciclismo com IA

Resumo
- App que usa IA (ex: ChatGPT/OpenAI) para gerar treinos diários personalizados para ciclismo (estrada, MTB, triathlon).
- Perfis com dados pessoais e de saúde: altura, peso, idade, VO2, FTP, FCmax, histórico de lesões.
- Calendário de provas que ajusta a periodização e intensidade.
- Assinaturas: Free (básico), Mensal R$49,90, Full R$99,90.
- Integração recomendada: Strava (API oficial). Garmin: requer parceria com Garmin Health API; fallback: export TCX/GPX/FIT.

MVP incluído neste repositório
- Spec API (openapi.yaml)
- Schema DB inicial (db-schema.sql)
- Templates de prompt para IA (prompt-templates.md)
- Backend minimal em Node/Express (src/server.ts, src/services/ai.ts)
- package.json com dependências básicas

Tech stack sugerido
- Backend: Node.js + TypeScript + Express (ou Fastify) ou Python FastAPI
- DB: PostgreSQL
- Mobile: React Native + Expo (cross-platform)
- IA: OpenAI (Chat Completions / Functions) ou outro LLM via API
- Pagamentos: Stripe (assinaturas + webhooks)
- Storage: S3 (arquivos TCX/FIT), Redis (cache, filas)
- Worker: Node/Sidekiq-like para geração batch de treinos e envio de notificações

Como usar o MVP localmente
1. Instale dependências: npm install
2. Configure variáveis de ambiente: OPENAI_API_KEY, DATABASE_URL, STRIPE_SECRET_KEY, STRAVA_CLIENT_ID/SECRET
3. Rodar servidor: npm run dev
4. Usar endpoints em openapi.yaml

Considerações legais e privacidade
- Dados de saúde são sensíveis: criptografar em repouso, TLS em trânsito.
- Gerir consentimento explícito (LGPD).
- Permitir exportação / exclusão de dados pelo usuário.

Roadmap curto (4-12 semanas)
- Semana 1–2: Backend + DB + Auth + endpoints IA
- Semana 3: Integração Strava + export TCX
- Semana 4: Pagamentos Stripe + planos
- Semana 5–6: App mobile (React Native) + UX treinos
- Semana 7–8: Testes com atletas beta, ajuste de prompts IA
- Semana 9+: Parceria Garmin Health (se necessário), features avançadas (periodização automática, microciclos, cargas de treino)
