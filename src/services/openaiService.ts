// src/services/openaiService.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "kwaipilot/kat-coder-pro:free"; // Free model

// ----------- Summary Generator ------------
export const generateGPTSummary = async (text: string) => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You are a helpful legal assistant. Summarize the email clearly and concisely, highlighting client intent and follow-up actions." },
          { role: "user", content: text },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const choices = response.data?.choices?.[0];
    return choices?.message?.content || choices?.text || "No summary generated.";
  } catch (error: any) {
    console.error("❌ GPT Summary Error:", error.response?.data || error.message);
    return "Error generating summary.";
  }
};

// ----------- Email Generator ------------
export const generateGPTEmail = async (prompt: string, thread: string) => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You are a helpful legal assistant. Write a professional client email based on the context and task." },
          { role: "user", content: `Context:\n${thread}\n\nTask:\n${prompt}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const choices = response.data?.choices?.[0];
    return choices?.message?.content || choices?.text || "No email generated.";
  } catch (error: any) {
    console.error("❌ GPT Email Error:", error.response?.data || error.message);
    return "Error generating email.";
  }
};
