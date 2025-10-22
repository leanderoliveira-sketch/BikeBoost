# BikeBoost - Integrações Avançadas: Push, FIT/XML, Dashboard, Strava/Garmin

## Push Notification
- Service Worker registrado em `/sw.js`
- Assinatura via frontend (PushManager)
- Backend salva subscription (`/api/push/subscribe`)
- Envio de mensagem via `/api/push/send`

## Exportação/Importação
- **FIT:** GET `/api/treino/:id/export/fit`
- **XML:** GET `/api/treino/:id/export/xml`
- **TCX:** GET `/api/treino/:id/export/tcx`
- **Strava Upload:** POST `/api/strava/upload-fit`
- **Garmin:** Exporta TCX/FIT e importa manualmente

## Dashboard Detalhado
- GET `/api/dashboard` retorna dados para gráficos (semanas, horas, tipos, intensidade média)

## Strava/Garmin
- OAuth para Strava, upload direto via API
- Para Garmin, exporte TCX/FIT e importe manualmente

## Observações
- Para Push real, use chaves VAPID e subscriptions do navegador
- Para FIT/XML, adapte campos conforme specs dos dispositivos
- Para Strava/Garmin, verifique limites e escopos das APIs
