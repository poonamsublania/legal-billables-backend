"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = void 0;
const axios_1 = __importDefault(require("axios"));
const generateSummary = async (prompt) => {
    const response = await axios_1.default.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt,
        max_tokens: 200,
    }, {
        headers: {
            Authorization: `Bearer ${process.env.GPT_KEY}`,
            "Content-Type": "application/json",
        },
    });
    return response.data.choices[0].text;
};
exports.generateSummary = generateSummary;
