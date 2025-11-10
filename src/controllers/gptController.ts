// src/controllers/gptController.ts
import { Request, Response } from "express";
import { generateGPTSummary } from "../services/openaiService"; // adjust import if needed

export const getBillableSummary = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const summary = await generateGPTSummary(content);

    res.json({ summary });
  } catch (error) {
    console.error("❌ Billable summary error:", error);
    res.status(500).json({ error: "Failed to generate billable summary" });
  }
};

