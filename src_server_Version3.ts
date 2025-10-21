// Servidor Express básico (Typescript)
import express from "express";
import bodyParser from "body-parser";
import { generateWorkoutForDate } from "./services/ai";

const app = express();
app.use(bodyParser.json());

app.post("/generate-workout", async (req, res) => {
  try {
    const { profile, date } = req.body;
    if (!profile || !date) return res.status(400).json({ error: "profile and date required" });
    const workout = await generateWorkoutForDate(profile, date);
    return res.json({ workout });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});