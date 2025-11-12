"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/clioRoutes.ts
const express_1 = __importDefault(require("express"));
const tokenStore_1 = __importDefault(require("../utils/tokenStore"));
const clioController_1 = require("../controllers/clioController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
//
// 🔐 Clio OAuth Routes
//
router.get("/auth", clioController_1.clioAuth);
router.get("/callback", clioController_1.clioCallback);
//
// 🧾 Push time entry to Clio
//
router.post("/push-to-clio", clioController_1.pushToClio);
//
// 🕒 Local/legacy time entry
//
router.post("/time-entry", authMiddleware_1.requireAuth, clioController_1.logTimeEntry);
router.get("/token", (0, authMiddleware_1.requireAuth)(true), clioController_1.getClioToken);
//
// 🧠 Debug route — inspect Clio token
//
router.get("/debug/token", async (req, res) => {
    try {
        const tokenDoc = await tokenStore_1.default.findById("singleton");
        if (!tokenDoc) {
            return res.status(404).json({ message: "⚠️ No Clio token found in DB" });
        }
        res.json({
            message: "✅ Clio token found",
            accessToken: tokenDoc.clioAccessToken
                ? tokenDoc.clioAccessToken.slice(0, 12) + "... (truncated)"
                : "none",
            expiresAt: tokenDoc.clioTokenExpiry,
            refreshToken: tokenDoc.clioRefreshToken ? "exists" : "none",
            fullRecord: tokenDoc,
        });
    }
    catch (err) {
        console.error("❌ Error fetching debug token:", err.message);
        res.status(500).json({ error: err.message });
    }
});
//
// 🧪 Test push route (mock Clio API call)
//
router.post("/test/push", async (req, res) => {
    const { description, duration } = req.body;
    try {
        console.log("✅ Mock pushing entry to Clio:", { description, duration });
        res.json({
            success: true,
            message: "Mock Clio push successful!",
            data: { description, duration },
        });
    }
    catch (error) {
        console.error("Push error:", error.message);
        res.status(500).json({ success: false, message: "Push failed", error });
    }
});
exports.default = router;
