
import express, { Request, Response } from "express";
import axios from "axios";
import { getClioToken } from "../utils/tokenStore";

const router = express.Router();

// POST /api/clio/log
router.post("/log", async (req: Request, res: Response) => {
  const token = getClioToken();

  if (!token) {
    return res.status(401).json({
      error: "User not authenticated with Clio. Please connect Clio first.",
    });
  }

  const { summary, timeSpent, email } = req.body;

  if (!summary || !timeSpent) {
    return res
      .status(400)
      .json({ error: "Missing summary or timeSpent in request body." });
  }

  try {
    const durationMinutes = Math.ceil(timeSpent / 60); // seconds to minutes

    // 🔧 Replace with real matter ID logic (e.g., based on email or user)
    const matterId = "1719986897";

    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      {
        time_entry: {
          description: summary,
          duration: durationMinutes,
          billable: true,
          matter_id: matterId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Time logged to Clio:", response.data);
    res.status(200).json({ success: true, entry: response.data });
  } catch (error: any) {
    console.error("❌ Error logging to Clio:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

export default router;
