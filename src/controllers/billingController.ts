import { Request, Response } from "express";
import { createClioTimeEntry } from "../services/clioService";
import ClioToken from "../models/clioToken";

// Use the saved token if Authorization header is missing
export const logBillable = async (req: Request, res: Response) => {
  try {
    const { description, durationInSeconds, matterId } = req.body;

    if (!description || !durationInSeconds || !matterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get token from header or MongoDB
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const savedToken = await ClioToken.findOne({ _id: "singleton" });
      if (!savedToken) return res.status(401).json({ error: "No Clio token found" });
      token = savedToken.clioAccessToken;
    }

    // Call Clio service
    const result = await createClioTimeEntry(token, description, durationInSeconds, matterId);

    res.json({ success: true, result });
  } catch (err: any) {
    console.error("❌ Error logging billable:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to log billable entry" });
  }
};
