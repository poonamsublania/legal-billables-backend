// src/controllers/billingController.ts
import { Request, Response } from "express";
import { logTimeEntry } from "../services/clioService";

export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    // Extract access token from Authorization header
    const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!accessToken) {
      return res.status(401).json({ error: "No access token" });
    }

    // Extract billable data from request body
    const { billableData } = req.body;
    if (!billableData) {
      return res.status(400).json({ error: "No billable data provided" });
    }

    const { matterId, userId, durationInSeconds, description, date } = billableData;

    // Validate required fields
    if (!matterId || !durationInSeconds || !description || !date) {
      return res.status(400).json({ error: "Missing required billable fields" });
    }

    // Prepare payload for Clio
    const timeEntryPayload = {
      matter_id: matterId,
      user_id: userId || undefined,
      duration: durationInSeconds,
      description,
      date,
    };

    // Call Clio service to log the time entry
    const timeEntry = await logTimeEntry(accessToken, timeEntryPayload);

    // Respond with success
    res.json({ success: true, timeEntry });
  } catch (error) {
    console.error("[BillingController] Error logging billable:", error);
    res.status(500).json({ error: "Failed to log time entry" });
  }
};
