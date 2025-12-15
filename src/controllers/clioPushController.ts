// src/controllers/clioPushController.ts
import { Request, Response } from "express";
import axios from "axios";
import { getClioAccessToken } from "../services/clioService";

export const pushToClio = async (req: Request, res: Response) => {
  try {
    const { trackedTime, subject, summary, matterId } = req.body;

    if (!trackedTime || !subject || !summary || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ⏱ Convert "18s" → hours (minimum 0.01)
    const seconds = parseInt(trackedTime.replace("s", ""), 10) || 0;
    const hours = Math.max(seconds / 3600, 0.01);

    const token = await getClioAccessToken();
    if (!token) throw new Error("No Clio token");

    // 🔑 YOUR REAL USER ID (from who_am_i)
    const USER_ID = "358719653";

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          quantity: Number(hours.toFixed(2)), // HOURS
          note: `${subject}\n\n${summary}`,
        },
        relationships: {
          matter: {
            data: { type: "Matter", id: String(matterId) },
          },
          user: {
            data: { type: "User", id: USER_ID },
          },
        },
      },
    };

    const clioRes = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ success: true, clio: clioRes.data });
  } catch (error: any) {
    console.error("❌ pushToClio failed:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
