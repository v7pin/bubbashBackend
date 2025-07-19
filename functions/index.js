// Firebase-specific imports
const functions = require("firebase-functions");
const { setGlobalOptions } = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Set max instances to limit cost
setGlobalOptions({ maxInstances: 10 });

// Load environment variables
dotenv.config();

// Import the Gemini suggestion logic
const { getGeminiSuggestion } = require("./geminiService");

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Define your POST route
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

// Export the Express app as a Firebase HTTPS function
exports.api = functions.https.onRequest(app);
