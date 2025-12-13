"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const ClioToken_1 = __importDefault(require("../models/ClioToken"));
const router = express_1.default.Router();
router.post("/clio/log", async (req, res) => {
    try {
        const { summary, duration, matterId } = req.body;
        if (!summary || !duration || !matterId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const tokenDoc = await ClioToken_1.default.findById("singleton");
        if (!tokenDoc) {
            return res.status(400).json({ error: "No Clio token found" });
        }
        const payload = {
            data: {
                type: "TimeEntry",
                description: summary,
                duration: Math.round(duration * 60), // minutes
                matter: { id: matterId },
                date: new Date().toISOString().split("T")[0],
            },
        };
        const response = await axios_1.default.post("https://app.clio.com/api/v4/activities", payload, {
            headers: {
                Authorization: `Bearer ${tokenDoc.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return res.json({
            message: "✅ Time entry pushed to Clio",
            data: response.data,
        });
    }
    catch (err) {
        console.error("❌ Clio Error:", err?.response?.data || err.message);
        return res.status(500).json({ error: "Failed to push to Clio" });
    }
});
exports.default = router;
