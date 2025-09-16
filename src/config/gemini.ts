// src/config/gemini.ts
import dotenv from "dotenv";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env");
}

// ✅ Export properly
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
