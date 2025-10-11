// src/controllers/billingController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken"; // MongoDB model for OAuth tokens

interface BillableData {
  matterId: string;
  durationInSeconds: number;
  description: string;
  date: string;
}

export const createTimeEntry = async (req: Request, res: Response) => {
  console.log("[BillingController] Incoming headers:", req.headers);
  console.log("[BillingController] Incoming body:", req.body);

  try {
    const { billableData } = req.body as { billableData: BillableData };

    if (!billableData) {
      return res.status(400).json({ error: "No billable data provided" });
    }

    const { matterId, description, durationInSeconds, date } = billableData;

    if (!matterId || !description || !durationInSeconds || !date) {
      return res.status(400).json({ error: "Missing required billableData fields" });
    }

    console.log("[BillingController] ✅ Billable Data:", billableData);

    // ----------------------------
    // 1️⃣ Get the stored Clio OAuth token from MongoDB
    // ----------------------------
    const tokenDoc = await ClioTokenModel.findOne({ user: "current-user" }); // adjust 'user' field if needed
    if (!tokenDoc || !tokenDoc.accessToken) {
      return res.status(401).json({ error: "No valid Clio access token found. Please connect first." });
    }

    let accessToken = tokenDoc.accessToken;

    console.log("[BillingController] 🔑 Clio Access Token retrieved");

    // Optional: refresh token logic if expired
    // if (tokenDoc.expiresAt && new Date(tokenDoc.expiresAt) < new Date()) {
    //   // implement refresh using tokenDoc.refreshToken
    // }

    // ----------------------------
    // 2️⃣ Prepare Clio payload
    // ----------------------------
    const payload = {
      data: {
        type: "time_entries",
        attributes: {
          note: description,
          date,
          quantity: durationInSeconds / 3600, // Clio expects hours
          billable: true,
        },
        relationships: {
          matter: {
            data: { id: matterId, type: "matters" },
          },
        },
      },
    };

    console.log("[BillingController] 📤 Sending payload to Clio:", payload);

    // ----------------------------
    // 3️⃣ Send time entry to Clio API
    // ----------------------------
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

    console.log("[BillingController] ✅ Clio Response:", response.data);

    res.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error("[BillingController] 🔴 Error logging billable:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error || err.message || "Failed to log time entry",
    });
  }
};
