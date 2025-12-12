import { Request, Response } from "express";
import WeeklySummary from "../models/weeklySummary";
import { openai } from "../config/openai"; // Your existing OpenAI config

/**
 * ------------------------------------------------------
 *  SAVE DAILY / GPT-GENERATED SUMMARY  (NO CHANGES)
 * ------------------------------------------------------
 */
export const saveWeeklySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientEmail, summary, subject } = req.body;

    if (!clientEmail || !summary) {
      res.status(400).json({ success: false, error: "Missing clientEmail or summary" });
      return;
    }

    const now = new Date();

    const dayNum = String(now.getDate()).padStart(2, "0");
    const monthNum = String(now.getMonth() + 1).padStart(2, "0");
    const yearNum = now.getFullYear();
    const date = `${dayNum}-${monthNum}-${yearNum}`;
    const day = now.toLocaleDateString("en-US", { weekday: "long" });

    const newSummary = new WeeklySummary({
      clientEmail,
      summary,
      subject,
      date,
      day,
      createdAt: now,
    });

    await newSummary.save();

    res.status(201).json({
      success: true,
      message: "Summary saved successfully!",
      summary: newSummary,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save summary" });
  }
};

/**
 * ------------------------------------------------------
 *  GET DAILY / GPT SUMMARIES (NO CHANGES)
 * ------------------------------------------------------
 */
export const getWeeklySummaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const summaries = await WeeklySummary.find().sort({ createdAt: -1 });
    if (!summaries.length) {
      res.json({ success: true, grouped: {} });
      return;
    }

    const grouped: Record<string, any[]> = {};
    summaries.forEach((entry) => {
      const key = `${entry.date} (${entry.day})`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    });

    res.json({ success: true, grouped });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch summaries" });
  }
};

/**
 * ------------------------------------------------------
 *  NEW: GENERATE WEEKLY LEGAL SUMMARY REPORT (PROFESSIONAL)
 * ------------------------------------------------------
 */
export const generateWeeklyLegalReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, hourlyRate = 150 } = req.body;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "startDate and endDate required" });
      return;
    }

    // Fetch entries from your weeklySummary collection
    const entries = await WeeklySummary.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    if (!entries.length) {
      res.status(404).json({ error: "No summaries found for the given date range" });
      return;
    }

    // Prepare text for GPT
    const entriesText = entries
      .map(
        (e) =>
          `Client: ${e.clientEmail}\nSubject: ${e.subject}\nSummary: ${e.summary}\nDate: ${e.date} (${e.day})`
      )
      .join("\n\n");

    const prompt = `
You are a senior legal billing analyst.  
Create a highly professional Weekly Legal Summary Report.

Required Sections:

📅 Weekly Summary Report (${startDate} — ${endDate})

🧠 Key Legal Themes This Week  
👥 Clients Covered  
💼 Matters Worked On  
📌 Major Work Completed  
⏳ Total Time & Revenue (Assume each summary = 1 hour unless specified)  
📉 Productivity Insights  
📄 Follow-Up Actions for Next Week  
💼 Client-by-Client Breakdown  

Entries:\n\n${entriesText}
    `;

    // Call GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const report = response.choices[0]?.message?.content || "No report generated.";

    res.status(200).json({
      success: true,
      report,
      entriesCount: entries.length,
    });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    res.status(500).json({ error: "Failed to generate weekly report" });
  }
};

/**
 * ------------------------------------------------------
 *  NEW: GET ALL GENERATED WEEKLY REPORTS (If you save them)
 * ------------------------------------------------------
 */
export const getWeeklyLegalReports = async (req: Request, res: Response) => {
  try {
    const reports = await WeeklySummary.find().sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly reports" });
  }
};
