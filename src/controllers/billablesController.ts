// src/controllers/billablesController.ts
import { Request, Response } from "express";
import Billable from "../models/Billable";

export const createBillable = async (req: Request, res: Response) => {
  try {
    const billable = new Billable(req.body);
    await billable.save();
    res.status(201).json(billable);
  } catch (err) {
    res.status(500).json({ error: "Failed to create billable", details: err });
  }
};

export const getBillables = async (_req: Request, res: Response) => {
  try {
    const billables = await Billable.find().sort({ createdAt: -1 });
    res.json(billables);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch billables", details: err });
  }
};

export const updateBillable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Billable.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Billable not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update billable", details: err });
  }
};

export const deleteBillable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Billable.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Billable not found" });
    res.json({ message: "Billable deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete billable", details: err });
  }
};
