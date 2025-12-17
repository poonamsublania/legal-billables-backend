import { Request, Response } from "express";
import ManualModel from "../models/manualModel";

export const createManualEntry = async (req: Request, res: Response) => {
  try {
    const {
      category,
      clientName,
      caseName,
      description,
      duration,
      date,
      timeSpent,
    } = req.body;

    const entry = await ManualModel.create({
      category,
      clientName,
      caseName,
      description,
      duration,
      date,
      timeSpent,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, entry });
  } catch (err: any) {
    console.error("❌ Error creating manual entry:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getManualEntries = async (_req: Request, res: Response) => {
  try {
    const entries = await ManualModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteManualEntry = async (req: Request, res: Response) => {
  try {
    await ManualModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
