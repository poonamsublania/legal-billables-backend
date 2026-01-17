import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --------------------
// Summary
// --------------------
export const generateGPTSummary = async (content: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `Summarize the following content professionally for legal billing:\n\n${content}`
  );

  return result.response.text();
};

// --------------------
// Email Generation
// --------------------
export const generateGPTEmail = async (
  prompt: string,
  thread: string
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(`
You are an AI assistant that writes professional legal emails.

Instruction:
${prompt}

Email thread:
${thread}
`);

  return result.response.text();
};
