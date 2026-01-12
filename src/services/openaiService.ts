import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateEmailSummary(content: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // ✅ stable & cheap
    messages: [
      { role: "system", content: "Summarize this email for legal billing." },
      { role: "user", content }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message?.content;
}
