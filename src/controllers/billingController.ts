import { Request, Response } from "express";
import { getClioToken, logTimeEntry } from "../services/clioService";

export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    const { billableData } = req.body;

    if (!billableData) {
      return res.status(400).json({ error: "Missing billableData" });
    }

    const { matterId, description, durationInSeconds, date } = billableData;

    if (!matterId || !description || !durationInSeconds || !date) {
      return res.status(400).json({ error: "Incomplete billable data" });
    }

    const token = await getClioToken();
    if (!token) {
      return res.status(401).json({ error: "No valid Clio token found" });
    }

    const result = await logTimeEntry(token, billableData);

    res.json({ success: true, timeEntry: result });
  } catch (err: any) {
    console.error("[BillingController] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
