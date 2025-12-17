"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushToClio = void 0;
const axios_1 = __importDefault(require("axios"));
const clioService_1 = require("../services/clioService");
const pushToClio = async (req, res) => {
    try {
        console.log("📥 Incoming body:", req.body);
        const { trackedTime, subject, summary, matterId } = req.body;
        if (!trackedTime || !subject || !summary || !matterId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const seconds = parseInt(trackedTime.replace("s", ""), 10) || 0;
        const hours = Math.max(seconds / 3600, 0.01);
        const token = await (0, clioService_1.getClioAccessToken)();
        if (!token)
            throw new Error("No Clio token");
        const USER_ID = "358719653"; // ✅ your real Clio user
        const payload = {
            data: {
                type: "TimeEntry",
                attributes: {
                    quantity: Number(hours.toFixed(2)),
                    note: `${subject}\n\n${summary}`,
                },
                relationships: {
                    matter: {
                        data: { type: "Matter", id: String(matterId) },
                    },
                    user: {
                        data: { type: "User", id: USER_ID },
                    },
                },
            },
        };
        const response = await axios_1.default.post("https://app.clio.com/api/v4/time_entries", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.json({ success: true, clio: response.data });
    }
    catch (err) {
        console.error("❌ pushToClio error:", err.response?.data || err.message);
        return res.status(500).json({
            success: false,
            error: err.response?.data || err.message,
        });
    }
};
exports.pushToClio = pushToClio;
