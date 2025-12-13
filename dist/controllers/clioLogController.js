"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logClioTime = void 0;
const ClioToken_1 = __importDefault(require("../models/ClioToken"));
const axios_1 = __importDefault(require("axios"));
const clioController_1 = require("./clioController");
const logClioTime = async (req, res) => {
    try {
        let tokenDoc = await ClioToken_1.default.findById("singleton");
        if (!tokenDoc)
            return res.status(401).json({ error: "Clio not connected yet" });
        // Refresh if expired
        if (!tokenDoc.expiresAt || Date.now() >= tokenDoc.expiresAt.getTime()) {
            console.log("🔄 Access token expired — refreshing...");
            await (0, clioController_1.refreshClioToken)();
            tokenDoc = await ClioToken_1.default.findById("singleton");
        }
        const { description, duration, matterId, date } = req.body;
        if (!description || !duration || !matterId)
            return res.status(400).json({ error: "Missing required fields" });
        const payload = {
            data: {
                type: "TimeEntry",
                attributes: {
                    description,
                    duration,
                    matter_id: matterId,
                    date: date || new Date().toISOString().split("T")[0],
                },
            },
        };
        const response = await axios_1.default.post("https://app.clio.com/api/v4/time_entries", payload, {
            headers: {
                Authorization: `Bearer ${tokenDoc.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Time entry logged in Clio:", response.data);
        res.json({ success: true, result: response.data });
    }
    catch (error) {
        console.error("❌ Failed:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to log time entry",
            details: error.response?.data || error.message,
        });
    }
};
exports.logClioTime = logClioTime;
