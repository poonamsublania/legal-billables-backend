import { Request, Response } from "express";
import { generateGPTEmail } from "../services/openaiService";

// wherever your email GPT logic exists
export const generateEmailFromThread = async (
  req: Request,
  res: Response
) => {
  try {
    const { prompt, thread } = req.body;

    if (!prompt || !thread) {
      return res
        .status(400)
        .json({ error: "Prompt and thread are required" });
    }

    // ✅ BOTH arguments passed
    const email = await generateGPTEmail(prompt, thread);

    res.json({ email });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate email" });
  }
};
