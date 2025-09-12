// src/routes/clioRoutes.ts
import { Router } from "express";
import axios from "axios";
import { getClioToken } from "../utils/tokenStore";

const router = Router();

/**
 * POST /api/clio/log
 * Body: { summary: string, timeSpent: number (seconds), matterId?: number }
 */
router.post("/log", async (req, res) => {
  const { summary, timeSpent, matterId } = req.body;

  try {
    const token = getClioToken();
    if (!token) {
      return res.status(401).json({ error: "❌ Not authenticated with Clio. Please login first." });
    }

    if (!summary || !timeSpent) {
      return res.status(400).json({ error: "❌ Missing required fields: summary or timeSpent" });
    }

    // If caller didn’t pass a matterId, use a fixed placeholder (replace this later with dynamic logic)
    const MATTER_ID = matterId ||1719986897 ;

    // Convert seconds → hours (Clio expects a decimal hour quantity)
    const quantityInHours = timeSpent / 3600;

    const response = await axios.post(
      "https://app.clio.com/api/v4/activities.json",
      {
        type: "TimeEntry",
        description: summary,
        matter: { id: MATTER_ID },
        quantity: quantityInHours,
        rate: 100, // optional: adjust or remove
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Logged time entry to Clio:", response.data);
    res.json({ success: true, entry: response.data });
  } catch (err: any) {
    console.error("❌ Error logging to Clio:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || "Failed to log entry to Clio" });
  }
});

export default router;
