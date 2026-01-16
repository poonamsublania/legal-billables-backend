// src/services/openaiService.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to retry on 429
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 5000): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 && i < retries) {
        console.warn(`⚠️ Rate limit hit, retrying in ${delayMs / 1000}s... (attempt ${i + 1})`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries reached for GPT request.");
};

export const generateGPTSummary = async (content: string) => {
  const response = await withRetry(() =>
    client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    })
  );

  return response.choices[0].message?.content || "";
};

export const generateGPTEmail = async (prompt: string, thread: string) => {
  const response = await withRetry(() =>
    client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant for email writing." },
        { role: "user", content: `Prompt: ${prompt}\nThread: ${thread}` },
      ],
    })
  );

  return response.choices[0].message?.content || "";
};
