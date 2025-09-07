// src/services/openaiEmailService.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateGPTEmail = async (prompt: string, thread?: string) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful legal assistant. Write professional client emails.",
      },
      {
        role: "user",
        content: thread ? `${thread}\n\n${prompt}` : prompt,
      },
    ];

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0]?.message?.content || "No email generated.";
  } catch (err: any) {
    console.error("❌ GPT Email Error:", err.response?.data || err.message);
    throw new Error("Failed to generate email");
  }
};
