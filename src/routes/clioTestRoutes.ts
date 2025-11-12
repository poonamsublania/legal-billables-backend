import express from "express";
import { getStoredTokens } from "../utils/tokenStore"; // ✅ Correct import

const router = express.Router();

// ✅ Debug route to check Clio token
router.get("/debug/token", async (req, res) => {
  try {
    const tokens = await getStoredTokens(); // ✅ Works correctly now

    if (!tokens || !tokens.clioAccessToken) {
      return res.status(404).json({ message: "⚠️ No Clio token found in DB" });
    }

    res.json({
      message: "✅ Clio token found",
      accessToken: tokens.clioAccessToken.slice(0, 12) + "... (truncated)",
      expiresAt: tokens.clioTokenExpiry,
      refreshToken: tokens.clioRefreshToken ? "exists" : "none",
    });
  } catch (err: any) {
    console.error("❌ Error fetching token:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
