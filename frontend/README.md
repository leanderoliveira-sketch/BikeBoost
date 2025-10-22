# BikeBoost Frontend - Componente GerarTreino

## Descrição

Componente React para gerar e visualizar planilhas semanais de treino de ciclismo.

## Funcionalidades

### Formulário de Geração
- **Objetivo**: Seleção entre Geral, Competição ou Específico
- **Semana do Ciclo**: Entrada numérica para selecionar a semana (1-52)

### Exibição de Resultados
- **Informações do Ciclo**: Exibe ciclo, semana, nível e objetivo
- **Tabela Semanal**: Mostra 7 dias com as seguintes colunas:
  - Dia (Segunda a Domingo)
  - Data (formato dd/mm/aaaa)
  - Tipo (Endurance, Intervalos, Recuperação, etc.)
  - Duração (em minutos)
  - Intensidade (Zonas de treinamento)
  - Observação (Instruções detalhadas)

## Como Executar

### Backend
```bash
cd /home/runner/work/BikeBoost/BikeBoost
npm install
npm run dev
```
O backend será iniciado em `http://localhost:3000`

### Frontend
```bash
cd /home/runner/work/BikeBoost/BikeBoost/frontend
npm install
npm start
```
O frontend será iniciado em `http://localhost:3001`

## API Endpoint

O componente consome o endpoint `/api/treino` com o seguinte formato:

**Request:**
```json
{
  "objetivo": "Geral",
  "semana": 1
}
```

**Response:**
```json
{
  "ciclo": "Base",
  "semana": 1,
  "nivel": "amador",
  "objetivo": "Geral",
  "dias": [
    {
      "dia": "Segunda",
      "data": "2025-10-20",
      "tipo": "Endurance",
      "duracao": "60 min",
      "intensidade": "Baixa (Z1-Z2)",
      "observacao": "Treino de recuperação ativa. Manter ritmo confortável para iniciar a semana."
    }
    // ... mais 6 dias
  ]
}
```

## Estrutura de Arquivos

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── GerarTreino.jsx    # Componente principal
│   │   └── GerarTreino.css    # Estilos do componente
│   ├── App.js                  # Componente raiz
│   ├── App.css
│   ├── index.js                # Entry point
│   └── index.css
└── package.json
```

## Ciclos de Treinamento

O backend determina automaticamente o ciclo baseado na semana:
- **Base**: Semanas 1-4
- **Build**: Semanas 5-8
- **Peak**: Semanas 9-12

## Screenshots

![Formulário](https://github.com/user-attachments/assets/fbeb0150-9373-42b3-938c-96c29c55804f)

![Resultado Completo](https://github.com/user-attachments/assets/9fc3fe63-b35e-4eaf-9e8f-cddc7684e9ad)
