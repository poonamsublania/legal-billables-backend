// backend/src/routes/clioRoutes.ts
import express from "express";
import TokenStore from "../utils/tokenStore";
import {
  clioAuth,
  clioCallback,
  pushToClio,
  logTimeEntry,
  getClioToken,
} from "../controllers/clioController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

//
// 🔐 Clio OAuth Routes
//
router.get("/auth", clioAuth);
router.get("/callback", clioCallback);

//
// 🧾 Push time entry to Clio
//
router.post("/push-to-clio", pushToClio);

//
// 🕒 Local/legacy time entry
//
router.post("/time-entry", requireAuth, logTimeEntry);
router.get("/token", requireAuth(true), getClioToken);

//
// 🧠 Debug route — inspect Clio token
//
router.get("/debug/token", async (req, res) => {
  try {
    const tokenDoc = await TokenStore.findById("singleton");
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
  } catch (err: any) {
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
  } catch (error: any) {
    console.error("Push error:", error.message);
    res.status(500).json({ success: false, message: "Push failed", error });
  }
});

export default router;
