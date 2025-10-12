import { Request, Response } from "express";
import Billable from "../models/Billable";
import Client from "../models/Client";
import Draft from "../models/Draft";

export const dashboardHandler = async (req: Request, res: Response) => {
  try {
    const billables = await Billable.find().sort({ date: -1 });
    const clients = await Client.find();
    const drafts = await Draft.find().sort({ createdAt: -1 });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyBillables = billables.filter(b => b.date > weekAgo);
    const totalHours = billables.reduce((sum, b) => sum + b.duration / 3600, 0);

    res.json({
      billables,
      clients,
      drafts,
      weeklyBillables,
      totalHours,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
