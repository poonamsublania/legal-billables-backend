import { Request, Response } from "express";
import axios from "axios";
import ClioToken from "../models/ClioToken"; // your existing token model

export const pushToClio = async (req: Request, res: Response) => {
  try {
    const { trackedTime, summary, subject } = req.body;

    // 🔐 Get stored token
    const token = await ClioToken.findOne({ _id: "singleton" });
    if (!token) {
      return res.status(401).json({ success: false, message: "No Clio token" });
    }

    // ⏱ Convert "25s" → minutes (Clio needs minutes)
    const seconds = parseInt(trackedTime.replace("s", ""), 10);
    const minutes = Math.max(1, Math.ceil(seconds / 60));

    // 🚀 Push activity to Clio
    const clioRes = await axios.post(
      "https://app.clio.com/api/v4/activities",
      {
        data: {
          type: "Activity",
          subject: subject || "Email work",
          note: summary,
          quantity: minutes,
          price: 0,
          matter: { id: 1749275048 },
          user: { id: 358719653 }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      clioActivityId: clioRes.data.data.id
    });

  } catch (err: any) {
    console.error("❌ Push to Clio failed:", err.response?.data || err);
    return res.status(500).json({ success: false });
  }
};
