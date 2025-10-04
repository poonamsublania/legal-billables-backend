// src/controllers/billingController.ts
import { Request, Response } from "express";
import { getClioToken, logTimeEntry } from "../services/clioService";

interface BillableData {
  matterId: string; // Clio expects string IDs
  durationInSeconds: number;
  description: string;
  date: string;
  userId?: string;
}

export const createTimeEntry = async (req: Request, res: Response) => {
  console.log("Incoming headers:", req.headers);
  console.log("Incoming body:", req.body);

  try {
    const { billableData } = req.body as { billableData: BillableData };

    if (!billableData) {
      return res.status(400).json({ error: "No billable data provided" });
    }

    console.log("[BillingController] Billable Data:", billableData);

    // Get Clio token
    const accessToken = await getClioToken();

    if (!accessToken) {
      console.error("[BillingController] ❌ No Clio access token found");
      return res.status(401).json({ error: "No valid Clio access token found" });
    }

    console.log("[BillingController] ✅ Clio Access Token retrieved");

    // Prepare payload exactly matching clioService types
    const timeEntryPayload = {
      description: billableData.description,
      durationInSeconds: billableData.durationInSeconds, // keep durationInSeconds
      date: billableData.date,
      matterId: billableData.matterId, // string
      userId: billableData.userId,
    };

    console.log("[BillingController] Payload for Clio:", timeEntryPayload);

    // Push time entry
    const result = await logTimeEntry(accessToken, timeEntryPayload);

    console.log("[BillingController] ✅ Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] 🔴 Error logging billable:", err);
    res.status(500).json({ error: (err as Error).message || "Failed to log time entry" });
  }
};
