"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGPTSummary = void 0;
// src/services/openaiService.ts
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("🔐 Loaded OpenRouter Key:", process.env.OPENROUTER_API_KEY?.slice(0, 5)); // ✅ Debug key
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const generateGPTSummary = async (text) => {
    try {
        const response = await axios_1.default.post(OPENROUTER_URL, {
            model: "openai/gpt-3.5-turbo", // or "gpt-3.5-turbo", "meta-llama/llama-3-70b-instruct", etc.
            messages: [
                {
                    role: "system",
                    content: "You are a helpful legal assistant. Summarize the following email.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const summary = response.data.choices[0]?.message?.content || "No summary generated.";
        return summary;
    }
    catch (error) {
        console.error("❌ GPT Error:", error.response?.data || error.message);
        throw new Error("Failed to generate summary");
    }
};
exports.generateGPTSummary = generateGPTSummary;
// ✅ TEMP DEBUG FUNCTION
const testGPT = async () => {
    const email = "Hi, just following up on our meeting regarding the Smith case...";
    try {
        const summary = await (0, exports.generateGPTSummary)(email);
        console.log("🎉 GPT Summary:", summary);
    }
    catch (err) {
        console.error("❌ Test GPT error:", err);
    }
};
testGPT();
