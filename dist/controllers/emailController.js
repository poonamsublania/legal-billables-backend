"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneratedEmail = void 0;
const openaiService_1 = require("../services/openaiService");
const getGeneratedEmail = async (req, res) => {
    try {
        const { prompt, thread } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const safeThread = thread && thread.trim() !== ""
            ? thread
            : "No prior email context provided.";
        const email = await (0, openaiService_1.generateGPTEmail)(prompt, safeThread);
        res.json({ email });
    }
    catch (error) {
        console.error("❌ Email generation error:", error);
        res.status(500).json({ error: "Failed to generate email" });
    }
};
exports.getGeneratedEmail = getGeneratedEmail;
