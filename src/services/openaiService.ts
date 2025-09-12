// src/services/openaiService.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// ----------- Summary Generator ------------
export const generateGPTSummary = async (text: string) => {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful legal assistant. Summarize the following email." },
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

  return response.data.choices[0]?.message?.content || "No summary generated.";
};

// ----------- Email Generator ------------
export const generateGPTEmail = async (prompt: string, thread: string) => {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful legal assistant. Write a professional client email." },
        { role: "user", content: `Context: ${thread}\n\nTask: ${prompt}` },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0]?.message?.content || "No email generated.";
};
