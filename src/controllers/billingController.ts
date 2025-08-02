import { Request, Response } from "express";
import { createClioTimeEntry } from "../services/clioService";

export const logBillable = async (req: Request, res: Response) => {
  try {
    const { token, billableData } = req.body;

    // Destructure billable data
    const { description, durationInSeconds, matterId } = billableData;

    // Call Clio service
    const result = await createClioTimeEntry(
      token,
      description,
      durationInSeconds,
      matterId
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ Error logging billable:", err);
    res.status(500).json({ error: "Failed to log billable entry" });
  }
};
