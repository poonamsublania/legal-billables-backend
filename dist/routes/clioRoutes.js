"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const tokenStore_1 = require("../utils/tokenStore");
const router = express_1.default.Router();
// POST /api/clio/log
router.post("/log", async (req, res) => {
    const token = (0, tokenStore_1.getClioToken)();
    if (!token) {
        return res.status(401).json({
            error: "User not authenticated with Clio. Please connect Clio first.",
        });
    }
    const { summary, timeSpent, email } = req.body;
    if (!summary || !timeSpent) {
        return res
            .status(400)
            .json({ error: "Missing summary or timeSpent in request body." });
    }
    try {
        const durationMinutes = Math.ceil(timeSpent / 60); // seconds to minutes
        // 🔧 Replace with real matter ID logic (e.g., based on email or user)
        const matterId = "1719986897";
        const response = await axios_1.default.post("https://app.clio.com/api/v4/time_entries", {
            time_entry: {
                description: summary,
                duration: durationMinutes,
                billable: true,
                matter_id: matterId,
            },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Time logged to Clio:", response.data);
        res.status(200).json({ success: true, entry: response.data });
    }
    catch (error) {
        console.error("❌ Error logging to Clio:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
});
exports.default = router;
