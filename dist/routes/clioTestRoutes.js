"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenStore_1 = require("../utils/tokenStore"); // ✅ Correct import
const router = express_1.default.Router();
// ✅ Debug route to check Clio token
router.get("/debug/token", async (req, res) => {
    try {
        const tokens = await (0, tokenStore_1.getStoredTokens)(); // ✅ Works correctly now
        if (!tokens || !tokens.clioAccessToken) {
            return res.status(404).json({ message: "⚠️ No Clio token found in DB" });
        }
        res.json({
            message: "✅ Clio token found",
            accessToken: tokens.clioAccessToken.slice(0, 12) + "... (truncated)",
            expiresAt: tokens.clioTokenExpiry,
            refreshToken: tokens.clioRefreshToken ? "exists" : "none",
        });
    }
    catch (err) {
        console.error("❌ Error fetching token:", err.message);
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
