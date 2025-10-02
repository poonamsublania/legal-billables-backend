// src/controllers/billingController.ts
import { Request, Response } from "express";

interface BillableData {
  matterId: string;
  userId?: string;
  durationInSeconds: number;
  description: string;
  date: string;
}

export const createTimeEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("[BillingController] Incoming request body:", req.body);

    const { billableData } = req.body as { billableData: BillableData };

    if (!billableData) {
      res.status(400).json({ error: "No billable data provided" });
      return;
    }

    console.log("[BillingController] Billable Data:", billableData);

    // 🚨 DEBUG MODE: reply immediately, skip Clio
    res.json({ success: true, received: billableData });
    return;

    // ===== Clio integration will go here later =====
    // const accessToken = await getClioToken();
    // if (!accessToken) {
    //   res.status(401).json({ error: "No valid Clio access token found" });
    //   return;
    // }
    //
    // const timeEntryPayload = {
    //   description: billableData.description,
    //   duration: billableData.durationInSeconds,
    //   date: billableData.date,
    //   matterId: billableData.matterId,
    //   userId: billableData.userId,
    // };
    //
    // const result = await logTimeEntry(accessToken, timeEntryPayload);
    // res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] Error logging billable:", err);
    res.status(500).json({ error: (err as Error).message || "Failed to log time entry" });
  }
};
