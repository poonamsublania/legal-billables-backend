"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeEntry = void 0;
const clioService_1 = require("../services/clioService");
const createTimeEntry = async (req, res) => {
    console.log("[BillingController] Incoming request body:", req.body);
    res.json({ success: true, message: "Route works!" });
    try {
        const { billableData } = req.body;
        if (!billableData) {
            res.status(400).json({ error: "No billable data provided" });
            return;
        }
        console.log("[BillingController] Billable Data:", billableData);
        const accessToken = await (0, clioService_1.getClioToken)();
        if (!accessToken) {
            res.status(401).json({ error: "No valid Clio access token found" });
            return;
        }
        console.log("[BillingController] Access Token:", accessToken);
        // ✅ Match the shape expected by logTimeEntry
        const timeEntryPayload = {
            description: billableData.description,
            duration: billableData.durationInSeconds,
            date: billableData.date,
            matterId: billableData.matterId,
            userId: billableData.userId,
        };
        const result = await (0, clioService_1.logTimeEntry)(accessToken, timeEntryPayload);
        console.log("[BillingController] Clio Response:", result);
        res.json({ success: true, timeEntry: result });
    }
    catch (err) {
        console.error("[BillingController] Error logging billable:", err);
        res
            .status(500)
            .json({ error: err.message || "Failed to log time entry" });
    }
};
exports.createTimeEntry = createTimeEntry;
