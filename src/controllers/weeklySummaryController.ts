import { Request, Response } from "express";
import WeeklySummary from "../models/weeklySummary";

/**
 * @desc Save a GPT-generated weekly summary
 * @route POST /api/weekly-summary
 */
export const saveWeeklySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientEmail, summary, subject } = req.body;

    if (!clientEmail || !summary) {
      res.status(400).json({ success: false, error: "Missing clientEmail or summary" });
      return;
    }

    const now = new Date();

    // ✅ Format as DD-MM-YYYY
    const dayNum = String(now.getDate()).padStart(2, "0");
    const monthNum = String(now.getMonth() + 1).padStart(2, "0");
    const yearNum = now.getFullYear();
    const date = `${dayNum}-${monthNum}-${yearNum}`;

    // ✅ Get weekday name (e.g., Monday)
    const day = now.toLocaleDateString("en-US", { weekday: "long" });

    // ✅ Save summary in MongoDB
    const newSummary = new WeeklySummary({
      clientEmail,
      summary,
      subject,
      date,
      day,
      createdAt: now,
    });

    await newSummary.save();

    console.log("✅ Weekly summary saved:", newSummary);

    res.status(201).json({
      success: true,
      message: "Summary saved successfully!",
      summary: newSummary,
    });
  } catch (error) {
    console.error("❌ Error saving weekly summary:", error);
    res.status(500).json({ success: false, error: "Failed to save summary" });
  }
};

/**
 * @desc Get all GPT-generated summaries grouped by date
 * @route GET /api/weekly-summary
 */
export const getWeeklySummaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const summaries = await WeeklySummary.find().sort({ createdAt: -1 });

    if (!summaries.length) {
      res.json({ success: true, grouped: {} });
      return;
    }

    // ✅ Group summaries by "date (day)"
    const grouped: Record<string, any[]> = {};
    summaries.forEach((entry) => {
      const key = `${entry.date} (${entry.day})`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    });

    console.log("📅 Grouped Weekly Summaries:", grouped);

    res.json({ success: true, grouped });
  } catch (error) {
    console.error("❌ Error fetching summaries:", error);
    res.status(500).json({ success: false, error: "Failed to fetch summaries" });
  }
};
