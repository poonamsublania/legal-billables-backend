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
 * Step 1 – Redirect user to Clio OAuth login
 * URL: /auth/clio/login
 */
router.get("/auth/clio/login", clioController_1.clioLogin);
/**
 * Step 2 – Handle OAuth callback
 * URL inside Clio Developer Portal:
 * http://127.0.0.1:5000/auth/clio/callback
 */
router.get("/auth/clio/callback", clioController_1.clioCallback);
/**
 * Manual token save (only for testing)
 * URL: /clio/save-token
 */
router.post("/clio/save-token", async (req, res) => {
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
        res.json({ success: true, saved });
    }
    catch (err) {
        console.error("❌ Failed to save token:", err.message);
        res.status(500).json({ error: err.message });
    }
});
/**
 * Get stored token
 * URL: /clio/token
 */
router.get("/clio/token", clioController_1.getClioToken);
exports.default = router;
