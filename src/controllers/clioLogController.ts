// src/controllers/clioLogController.ts
import { Request, Response } from "express";
import axios from "axios";
import { Document } from "mongoose";
import ClioTokenModel, { IClioToken } from "../models/ClioToken";
import { refreshClioToken } from "./clioController";

// ✅ Correct Mongoose document type
type ClioTokenDoc = Document & IClioToken;

export const logClioTime = async (req: Request, res: Response) => {
  try {
    let tokenDoc = await ClioTokenModel.findById<ClioTokenDoc>("singleton");

    if (!tokenDoc) {
      return res.status(401).json({ error: "Clio not connected yet" });
    }

    // 🔄 Refresh if expired
    if (!tokenDoc.expiresAt || Date.now() >= tokenDoc.expiresAt.getTime()) {
      console.log("🔄 Access token expired — refreshing...");
      await refreshClioToken();
      tokenDoc = await ClioTokenModel.findById<ClioTokenDoc>("singleton");

      if (!tokenDoc?.accessToken) {
        return res.status(401).json({ error: "Failed to refresh Clio token" });
      }
    }

    const { description, duration, matterId, date } = req.body;

    if (!description || !duration || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      data: {
        type: "time-entries",
        attributes: {
          description,
          duration,
          "activity-date": date || new Date().toISOString().split("T")[0],
        },
        relationships: {
          matter: {
            data: {
              type: "matters",
              id: matterId,
            },
          },
        },
      },
    };

    const response = await axios.post(
      "https://api.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Time entry logged in Clio:", response.data);
    res.json({ success: true, result: response.data });
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to log time entry",
      details: error.response?.data || error.message,
    });
  }
};
