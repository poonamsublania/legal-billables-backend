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
// ----------- Summary Generator ------------
const generateGPTSummary = async (text) => {
    const response = await axios_1.default.post(OPENROUTER_URL, {
        model: "openai/gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful legal assistant. Summarize the following email." },
            { role: "user", content: text },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
    });
    return response.data.choices[0]?.message?.content || "No summary generated.";
};
exports.generateGPTSummary = generateGPTSummary;
// ----------- Email Generator ------------
const generateGPTEmail = async (prompt, thread) => {
    const response = await axios_1.default.post(OPENROUTER_URL, {
        model: "openai/gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful legal assistant. Write a professional client email." },
            { role: "user", content: `Context: ${thread}\n\nTask: ${prompt}` },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
    });
    return response.data.choices[0]?.message?.content || "No email generated.";
};
exports.generateGPTEmail = generateGPTEmail;
