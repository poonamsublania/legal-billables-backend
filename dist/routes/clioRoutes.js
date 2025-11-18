"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clioRoutes.ts
const express_1 = __importDefault(require("express"));
const clioController_1 = require("../controllers/clioController");
const router = express_1.default.Router();
/**
 * Save token (manual testing only)
 */
router.post("/save-token", async (req, res) => {
    try {
        const { access_token, refresh_token, expires_in } = req.body;
        if (!access_token || !refresh_token || !expires_in) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const saved = await (0, clioController_1.saveOrUpdateClioToken)({
            access_token,
            refresh_token,
            expires_in,
        });
        return res.json({ success: true, saved });
    }
    catch (err) {
        console.error("❌ Failed to save token:", err.message);
        return res.status(500).json({ error: err.message });
    }
});
/**
 * Get stored token
 */
router.get("/token", clioController_1.getClioToken);
exports.default = router;
