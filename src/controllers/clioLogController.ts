// src/controllers/clioLogController.ts
import { Request, Response } from "express";
import ClioTokenModel from "../models/clioToken";
import axios from "axios";

export const logClioTime = async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioTokenModel.findById("singleton");

    if (!tokenDoc?.accessToken) {
      return res.status(401).json({ error: "No Clio connection found" });
    }

    const { description, duration, matterId } = req.body;

    if (!description || !duration || !matterId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      {
        data: {
          type: "TimeEntry",
          attributes: {
            description,
            duration,
            matter_id: matterId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`
        },
      }
    );

    res.json({ success: true, result: response.data });

  } catch (error: any) {
    console.error("❌ logClioTime failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to log time entry" });
  }
};
