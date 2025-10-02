"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioToken = exports.logTimeEntry = void 0;
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken")); // default import now
const logTimeEntry = async (req, res) => {
    try {
        const tokenDoc = await clioToken_1.default.findOne({ _id: "singleton" });
        if (!tokenDoc)
            return res.status(401).json({ error: "Connect Clio first" });
        const { description, duration, date, matterId } = req.body;
        if (!description || !duration || !date || !matterId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const payload = {
            data: {
                type: "TimeEntry",
                attributes: { description, duration, date, matter_id: matterId },
            },
        };
        const result = await axios_1.default.post("https://app.clio.com/api/v4/time_entries", payload, {
            headers: {
                Authorization: `Bearer ${tokenDoc.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        console.log("[ClioController] Time entry logged:", result.data);
        res.json({ success: true, result: result.data });
    }
    catch (err) {
        console.error("❌ Failed to log time entry:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to log time entry" });
    }
};
exports.logTimeEntry = logTimeEntry;
const getClioToken = async (req, res) => {
    try {
        const tokenDoc = await clioToken_1.default.findOne({ _id: "singleton" });
        if (!tokenDoc)
            return res.status(404).json({ error: "No Clio token found" });
        res.json({
            accessToken: tokenDoc.accessToken,
            expiresAt: tokenDoc.expiresAt,
        });
    }
    catch (err) {
        console.error("❌ Failed to fetch Clio token:", err.message);
        res.status(500).json({ error: "Failed to fetch Clio token" });
    }
};
exports.getClioToken = getClioToken;
