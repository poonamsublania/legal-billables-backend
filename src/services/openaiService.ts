// src/services/openaiService.ts
import OpenAI from "openai";
import pLimit from "p-limit";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Limit concurrent requests to avoid rate limits
const limit = pLimit(2); // max 2 GPT requests at the same time

// Helper function: Retry with exponential backoff on 429
const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 1000
): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 && i < retries) {
        const waitTime = delayMs * Math.pow(2, i); // exponential backoff
        console.warn(`⚠️ Rate limit hit, retrying in ${waitTime / 1000}s... (attempt ${i + 1})`);
        await new Promise(res => setTimeout(res, waitTime));
      } else {
        console.error("❌ GPT request failed:", err.message || err);
        throw err;
      }
    }
  }
  throw new Error("Max retries reached for GPT request.");
};

// Generate GPT summary for text
export const generateGPTSummary = (content: string): Promise<string> => {
  return limit(() =>
    withRetry(async () => {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content }],
        temperature: 0.5,
        max_tokens: 500,
      });
      return response.choices[0].message?.content || "";
    })
  );
};

// Generate GPT email response
export const generateGPTEmail = (prompt: string, thread: string): Promise<string> => {
  return limit(() =>
    withRetry(async () => {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant for email writing." },
          { role: "user", content: `Prompt: ${prompt}\nThread: ${thread}` },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });
      return response.choices[0].message?.content || "";
    })
  );
};
