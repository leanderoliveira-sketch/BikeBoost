# Templates de prompt para IA

Objetivo: gerar um treino diário/semana estruturado com zonas de potência/FC e instruções.

Dados que serão injetados no prompt (exemplo de JSON)
{
  "athlete": {
    "age": 35,
    "weight_kg": 72,
    "height_cm": 178,
    "vo2max": 54,
    "ftp_watts": 260,
    "hr_max": 192,
    "discipline": "estrada",
    "level": "amador",
    "weekly_hours": 8,
    "race_date": "2025-11-09",
    "race_goal": "sub-4h"
  },
  "history": {
    "last_4_weeks_load": "moderate",
    "injuries": []
  },
  "preferences": {
    "days_available": ["Mon","Wed","Sat","Sun"]
  }
}

Prompt base (exemplo) — enviar ao LLM:
"Você é um treinador de ciclismo. Recebe o perfil do atleta (JSON). Gere o plano de treino para a próxima semana que maximize preparação para a prova em {race_date}. Produza output em JSON estrurado com: day, duration_min, type (endurance, sweetspot, tempo, vo2, threshold, recovery, long_ride), target_power_pct_ftp (média ou zona), target_hr_pct_max, warmup_min, intervals (array com sets e repetições), description (texto curto), tss_estimate. Respeite disponibilidade do atleta."

Exemplo de resposta esperada (JSON):
{
  "week_start": "2025-10-20",
  "workouts": [
    {
      "date": "2025-10-20",
      "duration_min": 75,
      "type": "endurance",
      "target_power_pct_ftp": "55-65",
      "target_hr_pct_max": "60-70",
      "warmup_min": 10,
      "intervals": [],
      "tss_estimate": 55,
      "description": "Rolo ou estrada, ritmo confortável para trabalhar endurance"
    },
    ...
  ]
}

Observações para o LLM
- Use FTP (se disponível) para zonas de potência; caso não tenha, use FC.
- Produza métricas TSS aproximadas para orientar carga.
- Ajuste intensidade pré-competição (4 semanas out: base -> build -> peak).
- Se atleta é iniciante, limitar volume e não fazer sessões de alta intensidade sem progressão.