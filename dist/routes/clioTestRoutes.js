"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clioTestRoutes.ts
const express_1 = __importDefault(require("express"));
const tokenStore_1 = require("../utils/tokenStore");
const createClioTimeEntry_1 = require("../config/createClioTimeEntry");
const router = express_1.default.Router();
// Test route to create a Clio time entry
router.post("/clio/test-entry", async (req, res) => {
    try {
        const tokens = (0, tokenStore_1.getStoredTokens)();
        if (!tokens?.access_token) {
            return res.status(401).json({ error: "No access token found" });
        }
        const result = await (0, createClioTimeEntry_1.createClioTimeEntry)(tokens.access_token, {
            description: "Test entry from clioTestRoutes.ts",
            duration: 60, // 1 hour
            matter_id: process.env.TEST_MATTER_ID || "your-matter-id",
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error("❌ Error creating Clio time entry:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
