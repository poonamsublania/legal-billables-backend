"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGPTEmail = exports.generateGPTSummary = void 0;
// src/services/openaiService.ts
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "kwaipilot/kat-coder-pro:free"; // Free model your key can access
// ----------- Summary Generator ------------
const generateGPTSummary = async (text) => {
    try {
        const response = await axios_1.default.post(OPENROUTER_URL, {
            model: OPENROUTER_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful legal assistant. Summarize the following email concisely, highlighting client intent, legal topic, and any follow-up actions required.",
                },
                { role: "user", content: text },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data?.choices?.[0]?.message?.content || "No summary generated.";
    }
    catch (error) {
        console.error("❌ GPT Summary Error:", error.response?.data || error.message);
        return "Error generating summary.";
    }
};
exports.generateGPTSummary = generateGPTSummary;
// ----------- Email Generator ------------
const generateGPTEmail = async (prompt, thread) => {
    try {
        const response = await axios_1.default.post(OPENROUTER_URL, {
            model: OPENROUTER_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful legal assistant. Write a clear and professional email for a client based on the following task and context.",
                },
                { role: "user", content: `Context:\n${thread}\n\nTask:\n${prompt}` },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data?.choices?.[0]?.message?.content || "No email generated.";
    }
    catch (error) {
        console.error("❌ GPT Email Error:", error.response?.data || error.message);
        return "Error generating email.";
    }
};
exports.generateGPTEmail = generateGPTEmail;
