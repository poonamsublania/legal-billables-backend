import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -----------------------------
// GPT SUMMARY
// -----------------------------
export async function generateGPTSummary(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Summarize the following legal content clearly." },
      { role: "user", content },
    ],
  });

  return response.choices[0].message?.content || "";
}

// -----------------------------
// GPT EMAIL
// -----------------------------
export async function generateGPTEmail(content: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Write a professional legal email reply." },
      { role: "user", content },
    ],
  });

  return response.choices[0].message?.content || "";
}
