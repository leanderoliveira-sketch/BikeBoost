// Servidor Express básico (Typescript)
import express from "express";
import bodyParser from "body-parser";
import { generateWeeklyWorkout } from "./services/ai";

const app = express();
app.use(bodyParser.json());

// Endpoint original mantido para compatibilidade
app.post("/generate-workout", async (req, res) => {
  try {
    const { profile, date } = req.body;
    if (!profile || !date) return res.status(400).json({ error: "profile and date required" });
    const workout = await generateWeeklyWorkout(profile, date);
    return res.json({ workout });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

// Novo endpoint para gerar planilha semanal de treino
app.post("/api/treino", async (req, res) => {
  try {
    const { objetivo, semana } = req.body;
    if (!objetivo || !semana) {
      return res.status(400).json({ error: "objetivo e semana são obrigatórios" });
    }

    // Simular dados do perfil do atleta (em produção, viriam do banco de dados)
    const profile = {
      age: 35,
      weight_kg: 72,
      height_cm: 178,
      vo2max: 54,
      ftp_watts: 260,
      hr_max: 192,
      discipline: "estrada",
      level: "amador",
      weekly_hours: 8,
      objetivo: objetivo,
      semana_ciclo: semana
    };

    const weeklyWorkout = await generateWeeklyWorkout(profile, objetivo, semana);
    return res.json(weeklyWorkout);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao gerar treino" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
