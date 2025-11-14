// src/controllers/clioLogController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

export const logTimeToClio = async (req: Request, res: Response) => {
  try {
    const { matterId, contactId, minutes, description } = req.body;

    if (!matterId || !contactId || !minutes || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get stored Clio tokens
    const tokens = await ClioTokenModel.findById("singleton");
    if (!tokens) {
      return res.status(401).json({ error: "Clio tokens not found" });
    }

    // Create time entry
    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      {
        time_entry: {
          duration: minutes,
          description: description,
          matter_id: matterId,
          contact_id: contactId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.clioAccessToken}`,
        },
      }
    );

    return res.status(200).json({
      message: "Time logged successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.error("❌ Error logging time:", error.response?.data || error);
    return res.status(500).json({
      error: "Failed to log time",
      details: error.response?.data || error.message,
    });
  }
};
