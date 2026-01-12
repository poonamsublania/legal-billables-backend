import { Request, Response } from "express";
import {
  generateGeminiSummary,
  generateGeminiEmail,
} from "../services/geminiService";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const summary = await generateGeminiSummary(content);
    res.json({ summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmail = async (req: Request, res: Response) => {
  try {
    const { prompt, thread } = req.body;
    if (!prompt || !thread)
      return res.status(400).json({ error: "Prompt & thread required" });

    const email = await generateGeminiEmail(prompt, thread);
    res.json({ email });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
