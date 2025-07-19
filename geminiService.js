import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiSuggestion(bubbles) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a personal finance assistant.

The user has these spending categories ("bubbles"):

${bubbles
  .map(
    (b) =>
      `- ${b.name}: ₹${b.amount} total, spent ₹${b.spent}, daily spend ₹${b.dailySpend}, balance ₹${b.balance}, days left ~${b.daysLeft}`
  )
  .join("\n")}

Analyze:
1. Which bubbles are running out quickly? (based on days left)
2. Which are underutilized?
3. Give 1 short, helpful, friendly suggestion for the user.

Only return the suggestion text. Be friendly, concise, and smart.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  return text.trim();
}
