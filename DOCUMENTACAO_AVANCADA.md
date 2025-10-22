# BikeBoost - Integrações Avançadas

## Exportação/Importação
- **FIT:** GET `/api/treino/:id/export/fit`
- **XML:** GET `/api/treino/:id/export/xml`
- **JSON:** GET `/api/treinos/export/json`
- **CSV:** GET `/api/treinos/export/csv`
- **Importação JSON:** POST `/api/treinos/import/json` com `{ treinos: [ ... ] }`

## Notificações Push
- Service Worker registrado em `/sw.js`
- Frontend solicita permissão de push
- Backend envia notificações via Web Push para subscriptions
- Exibidas via Notification API ou Service Worker

## Dashboard Visual
- GET `/api/dashboard` retorna dados agregados para gráficos
- Frontend exibe gráficos Line e Bar usando Chart.js

## Exemplo de uso
- Exportar/importar: botões e formulários
- Push: usuário permite notificações, recebe alertas de backend (ex: novo treino)
- Dashboard: visualiza desempenho por semana/tipo

## Observações
- Para Web Push real, implemente subscription/endpoint e chaves VAPID
- XML/FIT exportação: adapte para requisitos do Garmin/Strava
- Dashboard: backend deve calcular agregados por semana/tipo
