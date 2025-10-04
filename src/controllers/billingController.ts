import { Request, Response } from "express";
import { logTimeEntry, pingClio } from "../services/clioService";

interface BillableData {
  matterId: string;
  durationInSeconds: number;
  description: string;
  date: string;
}

/**
 * Test Clio connection
 */
export const pingBillingService = async (_req: Request, res: Response) => {
  try {
    const result = await pingClio();
    res.json({ success: true, message: "Billing service is alive 🚀", data: result });
  } catch (err: unknown) {
    console.error("[BillingController] 🔴 Clio ping failed:", err);
    res.status(500).json({ error: (err as Error).message || "Clio ping failed" });
  }
};

/**
 * Create a new time entry in Clio
 */
export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    const { billableData } = req.body as { billableData: BillableData };

    if (!billableData) {
      return res.status(400).json({ error: "No billable data provided" });
    }

    console.log("[BillingController] Billable Data:", billableData);

    // Push time entry (token handled internally)
    const result = await logTimeEntry(billableData);

    console.log("[BillingController] ✅ Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] 🔴 Error logging billable:", err);
    res.status(500).json({ error: (err as Error).message || "Failed to log time entry" });
  }
};
