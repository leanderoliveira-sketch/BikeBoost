# BikeBoost - Fluxos de Integração Frontend/Backend

## Exportação de Treinos
- JSON: GET `/api/treinos/export/json` → baixa todos os treinos em formato JSON.
- CSV: GET `/api/treinos/export/csv` → baixa todos os treinos em CSV.
- TCX: GET `/api/treino/:id/export/tcx` → baixa o treino selecionado em formato TCX (para Garmin).

## Importação de Treinos
- JSON: POST `/api/treinos/import/json` com `{ treinos: [ ... ] }` para importar treinos em massa.

## Notificações Web
- GET `/api/notificacoes` → retorna lista de notificações do usuário.
- POST `/api/notificacoes/:id/lida` → marca notificação como lida.
- Frontend usa Web Notification API para exibir notificações push (simulado via polling).

## Permissões
- Todas rotas protegidas requerem token JWT no header `Authorization`.

## Exemplos de uso
- Botão exporta abre rota em nova aba (window.open).
- Importação envia arquivo JSON via formulário.
- Notificações exibidas automaticamente se permissão concedida.

## Personalização
- Adapte os componentes para importar/exportar outros formatos (ex: XML, FIT).
- Integre notificações reais via Service Worker e Push API para apps PWA/móveis.
