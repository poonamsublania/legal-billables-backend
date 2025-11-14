// src/controllers/clioController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken"; // default import now

export const logTimeEntry = async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    if (!tokenDoc) return res.status(401).json({ error: "Connect Clio first" });

    const { description, duration, date, matterId } = req.body;
    if (!description || !duration || !date || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: { description, duration, date, matter_id: matterId },
      },
    };

    const result = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[ClioController] Time entry logged:", result.data);
    res.json({ success: true, result: result.data });
  } catch (err: any) {
    console.error("❌ Failed to log time entry:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to log time entry" });
  }
};

export const getClioToken = async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    if (!tokenDoc) return res.status(404).json({ error: "No Clio token found" });

    res.json({
      accessToken: tokenDoc.accessToken,
      expiresAt: tokenDoc.expiresAt,
    });
  } catch (err: any) {
    console.error("❌ Failed to fetch Clio token:", err.message);
    res.status(500).json({ error: "Failed to fetch Clio token" });
  }
};
