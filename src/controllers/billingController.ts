// src/controllers/billingController.ts
import { Request, Response } from "express";
import { logTimeEntrySafe } from "../services/clioService";

interface BillableData {
  matterId: string;
  durationInSeconds: number;
  description: string; // will map to 'note' in Clio
  date: string; // YYYY-MM-DD
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

    console.log("[BillingController] Validated Billable Data:", billableData);

    // Log time entry using safe wrapper (handles token refresh)
    const result = await logTimeEntrySafe(billableData);

    console.log("[BillingController] Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] 🔴 Error logging billable:", err);

    res.status(500).json({
      error:
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        "Failed to log time entry",
    });
  }
};
