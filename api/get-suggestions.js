// api/get-suggestions.js
import { getGeminiSuggestion } from "../geminiService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { bubbles } = req.body;

    if (!bubbles || !Array.isArray(bubbles)) {
      return res.status(400).json({ error: "Invalid 'bubbles' array." });
    }

    const suggestion = await getGeminiSuggestion(bubbles);
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ error: "Failed to generate suggestion." });
  }
}
