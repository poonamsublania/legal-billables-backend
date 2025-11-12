"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmail = exports.getSummary = void 0;
const openaiService_1 = require("../services/openaiService");
// POST /api/gpt/summary
const getSummary = async (req, res) => {
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: "Content is required" });
    const summary = await (0, openaiService_1.generateGPTSummary)(content);
    res.json({ summary });
};
exports.getSummary = getSummary;
// POST /api/gpt/email
const getEmail = async (req, res) => {
    const { prompt, thread } = req.body;
    if (!prompt || !thread)
        return res.status(400).json({ error: "Prompt and thread are required" });
    const email = await (0, openaiService_1.generateGPTEmail)(prompt, thread);
    res.json({ email });
};
exports.getEmail = getEmail;
