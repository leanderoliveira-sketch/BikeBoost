# BikeBoost - Integração Frontend

## Upload Strava
- Usuário autentica via OAuth, recebe accessToken.
- Usa componente `<UploadStrava accessToken={...} />` para enviar arquivo FIT/TCX para Strava direto.

## Exportação Garmin
- Usuário baixa arquivo TCX/FIT via `<ExportarGarmin treinoId={...} />`.
- Faz upload manual para Garmin Connect (não há API pública para automação).

## Dashboard Customizado
- `<DashboardCustom />` busca dados agregados de `/api/dashboard` e exibe gráficos (Line, Bar, Doughnut).
- Backend precisa agregar dados de treinos por semana, tipo, intensidade.

## Observações
- Para Strava, fluxo OAuth e upload segue [docs oficiais](https://developers.strava.com/docs/uploads/).
- Para Garmin, apenas exportação manual é viável.
- Dashboards podem ser expandidos com mais métricas.
