// src/services/openaiService.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateGPTSummary = async (content: string) => {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content }],
  });

  return response.choices[0].message?.content || "";
};

export const generateGPTEmail = async (prompt: string, thread: string) => {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an AI assistant for email writing." },
      { role: "user", content: `Prompt: ${prompt}\nThread: ${thread}` },
    ],
  });

  return response.choices[0].message?.content || "";
};
