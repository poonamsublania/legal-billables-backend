import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { logTimeEntry, refreshClioToken } from "../controllers/clioController";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

const router = Router();

// Debug route to view token in MongoDB
router.get("/debug-tokens", async (req, res) => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    res.json(tokenDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token", details: err });
  }
});

// Clio API route to log time entry
router.post("/time-entry", async (req, res) => {
  try {
    // Ensure token exists
    let tokenDoc: IClioToken | null = await ClioTokenModel.findById("singleton");
    if (!tokenDoc) {
      return res.status(401).json({ error: "No Clio connection found. Authenticate first." });
    }

    // Refresh token if expired
    if (!tokenDoc.accessToken || !tokenDoc.expiresAt || Date.now() >= tokenDoc.expiresAt.getTime()) {
      console.log("[ClioRoutes] 🔄 Token expired or missing. Refreshing...");
      const newAccessToken = await refreshClioToken();
      tokenDoc.accessToken = newAccessToken;
      await tokenDoc.save(); // Automatically saves updated token
    }

    // Call the original logTimeEntry controller
    await logTimeEntry(req, res);

    // Optional: Ensure MongoDB has the latest token after logging
    const updatedTokenDoc = await ClioTokenModel.findById("singleton");
    console.log("[ClioRoutes] ✅ Token after logging time entry:", updatedTokenDoc);

  } catch (err: any) {
    console.error("❌ /time-entry failed:", err);
    res.status(500).json({ error: "Failed to log time entry", details: err.message });
  }
});

export default router;
