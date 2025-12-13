import { Request, Response } from "express";
import EmailEntry from "../models/emailEntry";

/**
 * GET /api/emails/latest
 * Returns the most recent EmailEntry
 */
export const getLatestEmailEntry = async (_req: Request, res: Response) => {
  try {
    const latest = await EmailEntry.findOne().sort({ _id: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No email entries found",
      });
    }

    res.json({
      success: true,
      data: latest,
    });
  } catch (error: any) {
    console.error("❌ Error fetching latest email entry:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
