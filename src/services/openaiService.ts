import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ---------------- GPT SUMMARY ----------------
export const generateGPTSummary = async (
  content: string
): Promise<string> => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Summarize the following legal content." },
      { role: "user", content },
    ],
  });

  return response.choices[0].message?.content || "";
};

// ---------------- GPT EMAIL ----------------
export const generateGPTEmail = async (
  prompt: string,
  thread: string
): Promise<string> => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional legal email drafting assistant.",
      },
      {
        role: "user",
        content: `Previous conversation:\n${thread}\n\nWrite email:\n${prompt}`,
      },
    ],
  });

  return response.choices[0].message?.content || "";
};
