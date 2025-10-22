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
  objetivo?: string;
  semana_ciclo?: number;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Função auxiliar para gerar dados de exemplo quando não há chave da OpenAI
function generateMockWeeklyWorkout(profile: AthleteProfile, objetivo: string, semana: number) {
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1); // Segunda-feira

  const dias = diasSemana.map((dia, index) => {
    const data = new Date(inicioSemana);
    data.setDate(inicioSemana.getDate() + index);
    
    // Tipos de treino variados
    const tipos = ['Endurance', 'Intervalos', 'Tempo', 'Recuperação', 'Long Ride', 'Sweet Spot', 'VO2 Max'];
    const intensidades = ['Baixa (Z1-Z2)', 'Moderada (Z2-Z3)', 'Alta (Z3-Z4)', 'Muito Alta (Z4-Z5)', 'Máxima (Z5-Z6)'];
    
    let tipo, duracao, intensidade, observacao;
    
    switch(index) {
      case 0: // Segunda
        tipo = 'Endurance';
        duracao = '60 min';
        intensidade = 'Baixa (Z1-Z2)';
        observacao = 'Treino de recuperação ativa. Manter ritmo confortável para iniciar a semana.';
        break;
      case 1: // Terça
        tipo = 'Intervalos';
        duracao = '75 min';
        intensidade = 'Alta (Z3-Z4)';
        observacao = '4x8min em Z4 com 4min recuperação. Foco em manter cadência de 90-95 rpm.';
        break;
      case 2: // Quarta
        tipo = 'Recuperação';
        duracao = '45 min';
        intensidade = 'Baixa (Z1-Z2)';
        observacao = 'Treino leve de recuperação. Boa oportunidade para trabalhar técnica de pedalada.';
        break;
      case 3: // Quinta
        tipo = 'Sweet Spot';
        duracao = '90 min';
        intensidade = 'Moderada (Z2-Z3)';
        observacao = '3x15min em Sweet Spot (88-93% FTP) com 5min recuperação entre séries.';
        break;
      case 4: // Sexta
        tipo = 'Recuperação';
        duracao = '30 min';
        intensidade = 'Baixa (Z1-Z2)';
        observacao = 'Treino curto de ativação. Prepare-se para o treino longo do fim de semana.';
        break;
      case 5: // Sábado
        tipo = 'Long Ride';
        duracao = '150 min';
        intensidade = 'Moderada (Z2-Z3)';
        observacao = 'Treino longo em ritmo de endurance. Foco em resistência aeróbica e nutrição durante o treino.';
        break;
      case 6: // Domingo
        tipo = 'Tempo';
        duracao = '90 min';
        intensidade = 'Alta (Z3-Z4)';
        observacao = '2x20min em ritmo de tempo com 10min recuperação. Simula esforço de prova.';
        break;
      default:
        tipo = 'Endurance';
        duracao = '60 min';
        intensidade = 'Baixa (Z1-Z2)';
        observacao = 'Treino padrão de endurance.';
    }

    // Ajustar observações baseado no objetivo
    if (objetivo === 'Competição') {
      observacao += ' Preparação focada em competição.';
    } else if (objetivo === 'Específico') {
      observacao += ' Treino específico para seu objetivo.';
    }

    return {
      dia,
      data: data.toISOString().split('T')[0],
      tipo,
      duracao,
      intensidade,
      observacao
    };
  });

  // Determinar ciclo baseado na semana
  let ciclo;
  if (semana <= 4) {
    ciclo = 'Base';
  } else if (semana <= 8) {
    ciclo = 'Build';
  } else if (semana <= 12) {
    ciclo = 'Peak';
  } else {
    ciclo = 'Base';
  }

  return {
    ciclo,
    semana,
    nivel: profile.level || 'amador',
    objetivo,
    dias
  };
}

export async function generateWeeklyWorkout(profile: AthleteProfile, objetivo: string, semana: number) {
  // Se não houver chave da API, usar dados de exemplo
  if (!OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY não configurada, usando dados de exemplo");
    return generateMockWeeklyWorkout(profile, objetivo, semana);
  }

  const prompt = buildWeeklyPrompt(profile, objetivo, semana);
  
  try {
    const resp = await callOpenAI(prompt);
    let json: any = null;
    try {
      json = JSON.parse(resp);
    } catch (e) {
      const m = resp.match(/\{[\s\S]*\}/);
      if (m) {
        try { 
          json = JSON.parse(m[0]); 
        } catch (e2) { 
          // Fallback para dados de exemplo se o parsing falhar
          return generateMockWeeklyWorkout(profile, objetivo, semana);
        }
      } else {
        return generateMockWeeklyWorkout(profile, objetivo, semana);
      }
    }
    return json;
  } catch (error) {
    console.error("Erro ao chamar OpenAI, usando dados de exemplo:", error);
    return generateMockWeeklyWorkout(profile, objetivo, semana);
  }
}

function buildWeeklyPrompt(profile: AthleteProfile, objetivo: string, semana: number) {
  return `Você é um treinador de ciclismo experiente. Gere uma planilha semanal de treino para um atleta com os seguintes dados:

Perfil do Atleta: ${JSON.stringify(profile)}
Objetivo: ${objetivo}
Semana do Ciclo: ${semana}

Responda SOMENTE em JSON com a seguinte estrutura:
{
  "ciclo": "Base/Build/Peak",
  "semana": ${semana},
  "nivel": "${profile.level}",
  "objetivo": "${objetivo}",
  "dias": [
    {
      "dia": "Segunda",
      "data": "2025-10-20",
      "tipo": "Endurance/Intervalos/Tempo/etc",
      "duracao": "60 min",
      "intensidade": "Baixa (Z1-Z2)/Moderada/Alta",
      "observacao": "Descrição detalhada do treino"
    }
  ]
}

Inclua todos os 7 dias da semana (Segunda a Domingo) com treinos variados e observações detalhadas para cada dia.`;
}

async function callOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um treinador de ciclismo experiente." }, 
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.2
    })
  });
  const j = await res.json();
  return j.choices?.[0]?.message?.content ?? JSON.stringify(j);
}
