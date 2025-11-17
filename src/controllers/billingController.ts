// src/controllers/billingController.ts
import { Request, Response } from "express";
import { createClioTimeEntry } from "../services/clioService";

export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    const { contactId, matterId, description, minutes } = req.body;

    if (!contactId || !matterId || !description || !minutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const clioResponse = await createClioTimeEntry({
      contactId,
      matterId,
      description,
      minutes,
    });

    return res.status(200).json({
      message: "Time entry created successfully",
      clio: clioResponse,
    });
  } catch (error: any) {
    console.error("❌ Error creating Clio time entry:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Error creating time entry",
      error: error.response?.data || error.message,
    });
  }
};
