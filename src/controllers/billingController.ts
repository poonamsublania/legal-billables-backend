// src/controllers/billingController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";
import { refreshClioToken } from "./clioController";

export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming /billing/time-entry request:", req.body);

    const { description, duration, date, matterId } = req.body;

    // Validate required fields
    if (!description || !duration || !date || !matterId) {
      console.log("❌ Missing fields:", req.body);
      return res.status(400).json({
        error: "Missing required fields. Required: description, duration, date, matterId",
      });
    }

    // Get token from DB
    let tokenDoc = await ClioTokenModel.findById("singleton");

    if (!tokenDoc) {
      console.log("❌ No Clio token exists in DB");
      return res.status(400).json({ error: "No Clio API token stored in backend" });
    }

    // Refresh token if expired
    if (new Date() >= new Date(tokenDoc.expiresAt)) {
      console.log("🔄 Token expired. Refreshing now...");
      await refreshClioToken();
      tokenDoc = await ClioTokenModel.findById("singleton"); // reload
    }

    const accessToken = tokenDoc!.accessToken;

    // Format payload for Clio v4 API
    const payload = {
      description,
      duration: Number(duration),   // Decimal hours (0.5 = 30 minutes)
      activity_date: date,          // YYYY-MM-DD
      matter: matterId,             // Clio matter ID
      billable: true,
    };

    console.log("📤 Sending to Clio:", payload);

    // Send to Clio
    const response = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Clio Response:", response.data);

    return res.status(200).json({
      success: true,
      message: "Time entry successfully created in Clio",
      clio: response.data,
    });
  } catch (error: any) {
    console.log("❌ Error in createTimeEntry:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Clio API request failed",
      details: error.response?.data || error.message,
    });
  }
};
