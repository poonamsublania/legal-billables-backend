// src/controllers/billingController.ts
import { Request, Response } from "express";
import { getClioToken, logTimeEntry } from "../services/clioService";

interface BillableData {
  matterId: string;
  durationInSeconds: number;
  description: string; // will be mapped to 'note' in Clio payload
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

    console.log("[BillingController] Billable Data:", billableData);

    // Get valid Clio token (auto-refresh if expired)
    const accessToken = await getClioToken();

    if (!accessToken) {
      return res.status(401).json({ error: "No valid Clio access token found" });
    }

    console.log("[BillingController] Clio Access Token retrieved");

    // Push time entry
    const result = await logTimeEntry(accessToken, billableData);

    console.log("[BillingController] Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] 🔴 Error logging billable:", err);
    res.status(500).json({
      error:
        (err as any)?.response?.data?.error ||
        (err as Error).message ||
        "Failed to log time entry",
    });
  }
};
