import { Request, Response } from "express";
import ClioToken from "../models/clioToken";
import axios from "axios";

export const logTimeEntry = async (req: Request, res: Response) => {
  try {
    const clioToken = await ClioToken.findById("singleton");
    if (!clioToken || !clioToken.clioAccessToken) {
      return res.status(401).json({ error: "User not authenticated with Clio. Please connect Clio first." });
    }

    const { description, duration, date } = req.body.time_entry; // note: nested time_entry
    console.log("➡️ Sending to Clio:", JSON.stringify(req.body, null, 2));

    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      { time_entry: { description, duration, date } },
      {
        headers: {
          Authorization: `Bearer ${clioToken.clioAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error("❌ Clio log failed:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to log time entry",
      details: err.response?.data || err.message,
    });
  }
};
