"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillableSummary = void 0;
const openaiService_1 = require("../services/openaiService"); // adjust import if needed
const getBillableSummary = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const summary = await (0, openaiService_1.generateGPTSummary)(content);
        res.json({ summary });
    }
    catch (error) {
        console.error("❌ Billable summary error:", error);
        res.status(500).json({ error: "Failed to generate billable summary" });
    }
};
exports.getBillableSummary = getBillableSummary;
