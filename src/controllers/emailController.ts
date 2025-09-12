// src/controllers/emailController.ts
import { Request, Response } from "express";
import { generateGPTEmail } from "../services/openaiService";

export const getGeneratedEmail = async (req: Request, res: Response) => {
  try {
    const { prompt, thread } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const email = await generateGPTEmail(prompt, thread || "");
    res.json({ email });
  } catch (error) {
    console.error("❌ Email generation error:", error);
    res.status(500).json({ error: "Failed to generate email" });
  }
};
