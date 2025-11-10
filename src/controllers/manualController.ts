import { Request, Response } from "express";
import ManualEntry from "../models/manualEntry";

export const createManualEntry = async (req: Request, res: Response) => {
  try {
    const { category, clientName, caseName, description, duration, date } = req.body;

    if (!category || !clientName || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "category, clientName, description, and duration are required",
      });
    }

    const entry = new ManualEntry({
      category,
      clientName,
      caseName,
      description,
      duration,
      date,
    });

    await entry.save();

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error("Error saving manual entry:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getManualEntries = async (req: Request, res: Response) => {
  try {
    const entries = await ManualEntry.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    console.error("Error fetching manual entries:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteManualEntry = async (req: Request, res: Response) => {
  try {
    const deleted = await ManualEntry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found" });
    }
    res.status(200).json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting manual entry:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
