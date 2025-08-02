"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillableSummary = void 0;
const openaiService_1 = require("../services/openaiService"); // this imports the real function from your service
// ⛔️ DO NOT re-export generateGPTSummary here if it's not defined in this file
// export { generateGPTSummary }; ❌ remove this line
// ✅ This is the actual route handler used in your route
const getBillableSummary = async (req, res) => {
    try {
        const { emailContent } = req.body;
        console.log("🟡 Received emailContent:", emailContent);
        if (!emailContent) {
            console.error("❌ Missing email content in request");
            return res.status(400).json({ error: "Missing email content" });
        }
        const summary = await (0, openaiService_1.generateGPTSummary)(emailContent);
        console.log("✅ GPT Summary:", summary);
        res.json({ summary });
    }
    catch (err) {
        console.error("❌ GPT Summary Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate summary" });
    }
};
exports.getBillableSummary = getBillableSummary;
