import { Request, Response } from "express";
import { getClioToken, logTimeEntry } from "../services/clioService";

interface BillableData {
  matterId: string;
  userId?: string;
  durationInSeconds: number;
  description: string;
  date: string;
}

export const createTimeEntry = async (req: Request, res: Response): Promise<void> => {
  console.log("[BillingController] Incoming request body:", req.body);
  res.json({ success: true, message: "Route works!" });

  try {
    const { billableData } = req.body as { billableData: BillableData };

    if (!billableData) {
      res.status(400).json({ error: "No billable data provided" });
      return;
    }

    console.log("[BillingController] Billable Data:", billableData);

    const accessToken = await getClioToken();
    if (!accessToken) {
      res.status(401).json({ error: "No valid Clio access token found" });
      return;
    }

    console.log("[BillingController] Access Token:", accessToken);

    // ✅ Match the shape expected by logTimeEntry
    const timeEntryPayload = {
      description: billableData.description,
      duration: billableData.durationInSeconds,
      date: billableData.date,
      matterId: billableData.matterId,
      userId: billableData.userId,
    };

    const result = await logTimeEntry(accessToken, timeEntryPayload);
    console.log("[BillingController] Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: unknown) {
    console.error("[BillingController] Error logging billable:", err);
    res
      .status(500)
      .json({ error: (err as Error).message || "Failed to log time entry" });
  }
};

