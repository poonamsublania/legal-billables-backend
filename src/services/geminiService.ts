import axios from "axios";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const geminiRequest = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    GEMINI_URL,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      params: {
        key: process.env.GEMINI_API_KEY,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response generated"
  );
};

// ===============================
// 🧠 SUMMARY
// ===============================
export const generateGeminiSummary = async (
  content: string
): Promise<string> => {
  return geminiRequest(`
You are a legal assistant.
Summarize the following content into a concise legal billable note:

${content}
`);
};

// ===============================
// 📧 EMAIL
// ===============================
export const generateGeminiEmail = async (
  prompt: string,
  thread: string
): Promise<string> => {
  return geminiRequest(`
You are a professional legal assistant.

Conversation context:
${thread}

Instruction:
${prompt}

Write a professional client email.
`);
};

// ===============================
// 🔁 BACKWARD COMPAT (DO NOT REMOVE)
// ===============================
export const generateGPTEmail = generateGeminiEmail;
