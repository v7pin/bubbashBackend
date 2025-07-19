import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getGeminiSuggestion } from "./geminiService.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://bubbash.netlify.app",
  // You can add your local dev URL, e.g. 'http://localhost:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Handle preflight requests for all routes
app.options("*", cors());

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
