import { Request, Response } from "express";
import EmailEntry from "../models/emailEntry";

/**
 * POST /api/emails/addon
 * Always creates a NEW entry (never update)
 */
export const saveAddonEmail = async (req: Request, res: Response) => {
  try {
    const entry = new EmailEntry({
      ...req.body,
      createdAt: new Date(),
    });

    await entry.save();

    return res.json({
      success: true,
      data: entry,
    });
  } catch (err) {
    console.error("❌ Add-on save failed:", err);
    return res.status(500).json({
      success: false,
      message: "Add-on save failed",
    });
  }
};
