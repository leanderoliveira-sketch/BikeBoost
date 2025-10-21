# Arquitetura proposta (texto)

Componentes principais
- Mobile App (React Native + Expo)
  - Cadastro, perfil, calendário de provas, exibição de treino diário
  - OAuth Strava/Google/Apple
- Backend API (Node + TypeScript + Express)
  - Autenticação (JWT + refresh tokens)
  - CRUD de perfil, provas, planos de treino
  - Orquestração da IA: montar prompt -> chamar LLM -> validar -> salvar
  - Integração com Strava e export TCX/FIT
  - Integração pagamentos (Stripe) e controle de acesso por plano
- Worker/Queue (BullMQ/Redis)
  - Geração agendada de treinos (diário/semanais)
  - Tarefas de sincronização com Strava
- Banco de dados (Postgres)
  - Tabelas: users, athlete_profiles, race_calendar, training_plans, workouts, subscriptions, oauth_tokens
- Storage (S3)
  - Salvar arquivos TCX/FIT/GPX gerados
- IA Provider
  - OpenAI Chat Completions (recomendado) ou outro LLM; usar função/JSON output quando possível
- Observability
  - Logs, traces, alertas (Sentry), métricas (Prometheus/Grafana)

Fluxo de geração de treino (simplificado)
1. Usuário atualiza perfil (FTP/VO2/FCmax, disponibilidade semanal, objetivo, provas)
2. Backend constrói prompt (usar template) e chama IA
3. IA retorna plano diário/semana em JSON estruturado
4. Backend valida e persiste em workouts
5. Worker sincroniza com Strava (se usuário autenticado) ou gera TCX para o usuário baixar
6. App mostra treino do dia e envia notificações

Notas sobre Garmin
- Garmin Connect público não expõe API para escrita sem parceria (Garmin Health API).
- Opções:
  - Aplicar para Garmin Health (recomendado para integração profunda)
  - Usuário baixa FIT/TCX gerado e faz upload manual
  - Usar Strava como proxy (usuário conecta Strava -> Garmin)