import express from "express";
import axios from "axios";
import Token from "../models/ClioToken";

const router = express.Router();

router.post("/clio/log", async (req, res) => {
  try {
    const { summary, duration, matterId } = req.body;

    if (!summary || !duration || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tokenDoc = await Token.findById("singleton");
    if (!tokenDoc) {
      return res.status(400).json({ error: "No Clio token found" });
    }

    const payload = {
      data: {
        type: "TimeEntry",
        description: summary,
        duration: Math.round(duration * 60), // minutes
        matter: { id: matterId },
        date: new Date().toISOString().split("T")[0],
      },
    };

    const response = await axios.post(
      "https://app.clio.com/api/v4/activities",
      payload,
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      message: "✅ Time entry pushed to Clio",
      data: response.data,
    });
  } catch (err: any) {
    console.error("❌ Clio Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Failed to push to Clio" });
  }
});

export default router;
