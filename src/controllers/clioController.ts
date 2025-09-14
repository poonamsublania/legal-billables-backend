// src/controllers/clioController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioToken from "../models/clioToken";

export const logTimeEntry = async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioToken.findOne({ _id: "singleton" });
    if (!tokenDoc) return res.status(401).json({ error: "Connect Clio first" });

    const { description, duration, date, matterId } = req.body;

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          description,
          duration,
          date,
          matter_id:1719986897 , // use your Clio matter ID
        },
      },
    };

    const result = await axios.post("https://app.clio.com/api/v4/time_entries", payload, {
      headers: {
        Authorization: `Bearer ${tokenDoc.clioAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ success: true, result: result.data });
  } catch (err: any) {
    console.error("❌ Failed to log time entry:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to log time entry" });
  }
};
