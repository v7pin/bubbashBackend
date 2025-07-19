import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getGeminiSuggestion } from "./geminiService.js";

dotenv.config();

const app = express();

// ✅ Allow specific origins (Netlify frontend and local dev)
const allowedOrigins = [
  "https://bubbash.netlify.app",
  "http://localhost:3000", // for local development
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Explicitly handle preflight OPTIONS requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// ✅ Main API route
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

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
