import { Request, Response } from "express";
import ManualModel from "../models/manualModel";

/**
 * CREATE Manual Entry
 */
export const createManualEntry = async (req: Request, res: Response) => {
  try {
    const { description, timeSpent, clioMatterId } = req.body;

    const entry = await ManualModel.create({
      description,
      timeSpent,
      clioMatterId,
      createdAt: new Date(),
    });

    res.status(201).json(entry);
  } catch (err: any) {
    console.error("❌ Error creating manual entry:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET Manual Entries
 */
export const getManualEntries = async (req: Request, res: Response) => {
  try {
    const entries = await ManualModel.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err: any) {
    console.error("❌ Error fetching manual entries:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE Manual Entry
 */
export const deleteManualEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ManualModel.findByIdAndDelete(id);
    res.json({ message: "Entry deleted" });
  } catch (err: any) {
    console.error("❌ Error deleting entry:", err);
    res.status(500).json({ error: err.message });
  }
};
