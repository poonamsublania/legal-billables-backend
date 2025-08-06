"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBillable = void 0;
const clioService_1 = require("../services/clioService");
const logBillable = async (req, res) => {
    try {
        const { token, billableData } = req.body;
        // Destructure billable data
        const { description, durationInSeconds, matterId } = billableData;
        // Call Clio service
        const result = await (0, clioService_1.createClioTimeEntry)(token, description, durationInSeconds, matterId);
        res.json({ success: true, result });
    }
    catch (err) {
        console.error("❌ Error logging billable:", err);
        res.status(500).json({ error: "Failed to log billable entry" });
    }
};
exports.logBillable = logBillable;
