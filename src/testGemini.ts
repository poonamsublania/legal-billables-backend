import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./config/gemini";

(async () => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent("Write a short test email to a client.");
    console.log("✅ Result:", result.response.text());
  } catch (err: any) {
    console.error("❌ Gemini test failed:", err);
  }
})();
