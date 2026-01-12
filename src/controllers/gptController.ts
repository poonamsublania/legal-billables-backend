import { Request, Response } from "express";
import {
  generateGPTSummary,
  generateGPTEmail,
} from "../services/openaiService";

// POST /api/gpt/summary
export const getSummary = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const summary = await generateGPTSummary(content);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

// POST /api/gpt/email
export const getEmail = async (req: Request, res: Response) => {
  try {
    const { prompt, thread } = req.body;

    if (!prompt || !thread) {
      return res
        .status(400)
        .json({ error: "Prompt and thread are required" });
    }

    // ✅ Combine into ONE argument (IMPORTANT)
    const content = `
Email Thread:
${thread}

Instruction:
${prompt}
`;

    const email = await generateGPTEmail(content);
    res.json({ email });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate email" });
  }
};
