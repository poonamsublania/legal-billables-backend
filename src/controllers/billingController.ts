import { Request, Response } from "express";
import { getClioToken, logTimeEntry } from "../services/clioService";
import { createClioTimeEntry } from "../config/createClioTimeEntry";

interface BillableData {
  matterId: string;
  durationInSeconds: number;
  description: string;
  date: string;
  userId?: string;
}

export const createTimeEntry = async (req: Request, res: Response) => {
  console.log("=== Incoming Request ===");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    const { billableData } = req.body as { billableData: any };
    if (!billableData) {
      console.error("❌ No billableData received!");
      return res.status(400).json({ error: "No billableData provided" });
    }

    console.log("[BillingController] Billable Data:", billableData);

    const accessToken = await getClioToken();
    console.log("[BillingController] Clio Access Token:", accessToken);
    if (!accessToken) return res.status(401).json({ error: "No valid Clio access token found" });

    const timeEntryPayload = {
      description: billableData.description,
      duration: billableData.durationInSeconds,
      date: billableData.date,
      matterId: billableData.matterId,
      userId: billableData.userId,
    };

    console.log("[BillingController] Payload sent to Clio:", timeEntryPayload);

    const result = await logTimeEntry(accessToken, timeEntryPayload);
    console.log("[BillingController] Clio Response:", result);

    res.json({ success: true, timeEntry: result });
  } catch (err: any) {
    console.error("[BillingController] Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: err.response?.data || err.message || "Failed to log time entry" });
  }
};
