// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("⚠️ GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generate a summary using Gemini.
 */
export const generateGPTSummary = async (content: string): Promise<string> => {
  try {
    // Create model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(content);

    // Extract text
    const text = result.response?.text() ?? "No summary generated";
    return text;
  } catch (err) {
    console.error("❌ Gemini summary error:", err);
    return "Failed to generate summary";
  }
};

/**
 * Generate an email using Gemini.
 */
export const generateGPTEmail = async (prompt: string, thread: string): Promise<string> => {
  try {
    const combinedPrompt = `${prompt}\n\nThread:\n${thread}`;

    // Create model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(combinedPrompt);

    const text = result.response?.text() ?? "No email generated";
    return text;
  } catch (err) {
    console.error("❌ Gemini email error:", err);
    return "Failed to generate email";
  }
};
