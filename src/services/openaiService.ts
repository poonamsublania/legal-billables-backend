// src/services/openaiService.ts
import OpenAI from "openai";
import pLimit from "p-limit";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("⚠️ OPENAI_API_KEY is missing!");

// Initialize OpenAI client
const client = new OpenAI({ apiKey });

// Limit concurrent GPT requests (adjust number if needed)
const limit = pLimit(2); // max 2 GPT calls at a time

// Exponential backoff retry helper
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const withRetry = async <T>(fn: () => Promise<T>, retries = 5, baseDelay = 1000): Promise<T> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 && attempt < retries) {
        const delay = baseDelay * Math.pow(2, attempt); // exponential backoff: 1s, 2s, 4s...
        console.warn(`⚠️ Rate limit hit, retrying in ${delay / 1000}s (attempt ${attempt + 1})`);
        await sleep(delay);
      } else if (err.status === 401) {
        console.error("❌ OpenAI API key invalid or missing!");
        throw err;
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries reached for GPT request.");
};

// Generate GPT summary (safe, with concurrency limit)
export const generateGPTSummary = (content: string) =>
  limit(() =>
    withRetry(() =>
      client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content }],
      })
    )
  ).then(res => res.choices[0]?.message?.content || "No content generated");

// Generate GPT email (safe, with concurrency limit)
export const generateGPTEmail = (prompt: string, thread: string) =>
  limit(() =>
    withRetry(() =>
      client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant for email writing." },
          { role: "user", content: `Prompt: ${prompt}\nThread: ${thread}` },
        ],
      })
    )
  ).then(res => res.choices[0]?.message?.content || "No content generated");
