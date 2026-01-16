import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("⚠️ OPENAI_API_KEY is missing!");

const client = new OpenAI({ apiKey });

// Retry helper
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 && i < retries) {
        console.warn(`⚠️ Rate limit hit, retrying in ${delayMs}ms (attempt ${i + 1})`);
        await new Promise(res => setTimeout(res, delayMs));
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

export const generateGPTSummary = async (content: string) => {
  const response = await withRetry(() =>
    client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    })
  );

  return response.choices[0]?.message?.content || "No content generated";
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

  return response.choices[0]?.message?.content || "No content generated";
};
