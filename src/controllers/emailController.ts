import { Request, Response } from "express";
import { generateGPTEmail } from "../services/openaiService";

export const getGeneratedEmail = async (req: Request, res: Response) => {
  // ✅ Add this at the very top
  console.log("💡 GPT email endpoint hit:", req.body);

  try {
    const { prompt, thread } = req.body;
    if (!prompt || !thread) {
      console.error("Missing prompt or thread");
      return res.status(400).json({ error: "Prompt and thread are required" });
    }

    const email = await generateGPTEmail(prompt, thread);
    console.log("Generated email successfully");
    return res.json({ email });
  } catch (err: any) {
    console.error("GPT Email generation error:", err);
    return res.status(500).json({ error: "Failed to generate email", details: err.message });
  }
};
