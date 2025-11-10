// src/services/openaiService.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// ----------- Summary Generator ------------
export const generateGPTSummary = async (text: string) => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "mistralai/mixtral-8x7b",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful legal assistant. Summarize the following email concisely and clearly, highlighting client intent, legal topic, and any follow-up actions required.",
          },
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

    return (
      response.data?.choices?.[0]?.message?.content ||
      "No summary generated."
    );
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
        model: "mistralai/mixtral-8x7b",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful legal assistant. Write a clear and professional email for a client based on the following task and context.",
          },
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

    return (
      response.data?.choices?.[0]?.message?.content ||
      "No email generated."
    );
  } catch (error: any) {
    console.error("❌ GPT Email Error:", error.response?.data || error.message);
    return "Error generating email.";
  }
};
