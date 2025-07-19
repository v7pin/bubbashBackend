import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getGeminiSuggestion } from "./geminiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/get-suggestions", async (req, res) => {
  try {
    const { bubbles } = req.body;

    if (!bubbles || !Array.isArray(bubbles)) {
      return res.status(400).json({ error: "Invalid 'bubbles' array." });
    }

    const suggestion = await getGeminiSuggestion(bubbles);
    res.json({ suggestion });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ error: "AI failed to generate suggestion." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
