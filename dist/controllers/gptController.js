"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillableSummary = void 0;
const openaiService_1 = require("../services/openaiService");
/**
 * Controller: getBillableSummary
 * Handles GPT summary generation for billable emails.
 * Accepts either:
 *  - { content: "...full text..." }
 *  - { subject: "...", body: "..." }
 */
const getBillableSummary = async (req, res) => {
    try {
        const { content, subject, body } = req.body;
        // Support both formats
        const text = content || `${subject || ""}\n${body || ""}`.trim();
        if (!text) {
            console.warn("⚠️ Missing email content in request body");
            return res.status(400).json({ error: "Email content is required" });
        }
        console.log("🧠 Generating GPT summary for content length:", text.length);
        const summary = await (0, openaiService_1.generateGPTSummary)(text);
        if (!summary) {
            console.error("❌ OpenAI returned empty summary");
            return res.status(500).json({ error: "No summary returned from GPT" });
        }
        console.log("✅ GPT summary generated successfully");
        res.status(200).json({ summary });
    }
    catch (error) {
        console.error("❌ Billable summary error:", error.message || error);
        res.status(500).json({
            error: "Failed to generate billable summary",
            details: error.message || error,
        });
    }
};
exports.getBillableSummary = getBillableSummary;
