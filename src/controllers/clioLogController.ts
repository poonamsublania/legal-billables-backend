import { Request, Response } from "express";
import ClioTokenModel, { IClioToken } from "../models/clioToken";
import axios from "axios";
import { refreshClioToken } from "./clioController";

export const logClioTime = async (req: Request, res: Response) => {
  try {
    let tokenDoc: IClioToken | null = await ClioTokenModel.findById("singleton");
    if (!tokenDoc) return res.status(401).json({ error: "No Clio connection found" });

    // Refresh if expired
    if (!tokenDoc.accessToken || !tokenDoc.expiresAt || Date.now() >= tokenDoc.expiresAt.getTime()) {
      tokenDoc.accessToken = await refreshClioToken();
      tokenDoc = await ClioTokenModel.findById("singleton"); // reload updated token
      if (!tokenDoc) return res.status(500).json({ error: "Failed to refresh Clio token" });
    }

    const { description, duration, matterId, date } = req.body;
    if (!description || !duration || !matterId) return res.status(400).json({ error: "Missing required fields" });

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          description,
          duration,
          matter_id: matterId,
          date: date || new Date().toISOString().split("T")[0],
        },
      },
    };

    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[ClioLogController] ✅ Time entry logged:", response.data);
    res.json({ success: true, result: response.data });
  } catch (error: any) {
    console.error("❌ logClioTime failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to log time entry", details: error.response?.data || error.message });
  }
};
