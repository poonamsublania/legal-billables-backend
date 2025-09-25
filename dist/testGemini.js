"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const gemini_1 = require("./config/gemini");
(async () => {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(gemini_1.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Write a short test email to a client.");
        console.log("✅ Result:", result.response.text());
    }
    catch (err) {
        console.error("❌ Gemini test failed:", err);
    }
})();
