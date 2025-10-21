// Serviço de integração com OpenAI (exemplo) - Typescript
import fetch from "node-fetch";

type AthleteProfile = {
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  vo2max?: number;
  ftp_watts?: number;
  hr_max?: number;
  discipline?: string;
  level?: string;
  weekly_hours?: number;
  race_date?: string | null;
  days_available?: string[]; // ["Mon","Wed",...]
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateWorkoutForDate(profile: AthleteProfile, date: string) {
  const prompt = buildPrompt(profile, date);
  const resp = await callOpenAI(prompt);
  // Tentativa de parse do JSON retornado
  let json: any = null;
  try {
    // Se a resposta for um JSON cru, parse; caso contrário, extrair primeiro trecho JSON
    json = JSON.parse(resp);
  } catch (e) {
    // tentar extrair bloco JSON usando regex
    const m = resp.match(/\{[\s\S]*\}/);
    if (m) {
      try { json = JSON.parse(m[0]); } catch (e2) { json = { raw: resp }; }
    } else {
      json = { raw: resp };
    }
  }
  return json;
}

function buildPrompt(profile: AthleteProfile, date: string) {
  return `Você é um treinador de ciclismo. Gere um treino para o atleta com os dados abaixo para a data ${date}.
Atleta: ${JSON.stringify(profile)}
Responda SOMENTE em JSON, com as chaves: date, duration_min, type, target_power_pct_ftp, target_hr_pct_max, warmup_min, intervals, tss_estimate, description.`;
}

async function callOpenAI(prompt: string) {
  // Exemplo usando o endpoint Chat Completions (modelo gpt-4o-mini ou gpt-4o)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Você é um treinador de ciclismo experiente." }, { role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.2
    })
  });
  const j = await res.json();
  // retorno do primeiro content
  return j.choices?.[0]?.message?.content ?? JSON.stringify(j);
}