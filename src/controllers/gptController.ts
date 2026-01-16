// src/controllers/gptController.ts
import { Request, Response } from "express";
import { generateGPTSummary, generateGPTEmail } from "../services/openaiService";

// POST /api/gpt/summary
export const getSummary = async (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  const summary = await generateGPTSummary(content);
  res.json({ summary });
};

// POST /api/gpt/email
export const getEmail = async (req: Request, res: Response) => {
  const { prompt, thread } = req.body;
  if (!prompt || !thread) return res.status(400).json({ error: "Prompt and thread are required" });

  const email = await generateGPTEmail(prompt, thread);
  res.json({ email });
};
