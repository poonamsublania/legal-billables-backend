import { Request, Response } from "express";
import { generateGPTSummary } from "../services/openaiService"; // this imports the real function from your service

// ⛔️ DO NOT re-export generateGPTSummary here if it's not defined in this file
// export { generateGPTSummary }; ❌ remove this line

// ✅ This is the actual route handler used in your route
export const getBillableSummary = async (req: Request, res: Response) => {
  try {
    const { emailContent } = req.body;

    console.log("🟡 Received emailContent:", emailContent);

    if (!emailContent) {
      console.error("❌ Missing email content in request");
      return res.status(400).json({ error: "Missing email content" });
    }

    const summary = await generateGPTSummary(emailContent);

    console.log("✅ GPT Summary:", summary);

    res.json({ summary });
  } catch (err: any) {
    console.error("❌ GPT Summary Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
