import { Request, Response } from "express";
import { createClioTimeEntry } from "../services/clioService";
import ClioToken from "../models/clioToken";

export const logBillable = async (req: Request, res: Response) => {
  try {
    const { description, durationInSeconds, matterId } = req.body;

    if (!description || !durationInSeconds || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Get token from MongoDB
    const tokenDoc = await ClioToken.findById("singleton");
    if (!tokenDoc || !tokenDoc.clioAccessToken) {
      return res.status(401).json({ error: "No Clio token found. Please authenticate first." });
    }

    // ✅ Call Clio service
    const result = await createClioTimeEntry(
      tokenDoc.clioAccessToken,
      description,
      durationInSeconds,
      matterId
    );

    res.json({ success: true, result });
  } catch (err: any) {
    console.error("❌ Error logging billable:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to log billable entry" });
  }
};
