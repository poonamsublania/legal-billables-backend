// src/controllers/emailController.ts
import { Request, Response } from "express";
import { generateGPTEmail } from "../services/openaiEmailService";

export const getGeneratedEmail = async (req: Request, res: Response) => {
  const { prompt, thread } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const email = await generateGPTEmail(prompt, thread);
    res.json({ email });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate email" });
  }
};
