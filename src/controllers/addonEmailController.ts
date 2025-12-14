import { Request, Response } from "express";
import AddonEmailEntry from "../models/addonEmailEntry";

/**
 * POST /api/addon/save
 */
export const saveAddonEmailEntry = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📨 ADDON SAVE BODY:", req.body);

    const entry = await AddonEmailEntry.create({
      subject: req.body.subject,
      clientEmail: req.body.clientEmail,
      date: req.body.date,
      trackedTime: req.body.trackedTime,
      summary: req.body.summary, // 🔥 IMPORTANT
      status: "Pending",
    });

    return res.json({ success: true, data: entry });
  } catch (err) {
    console.error("❌ Addon save error:", err);
    return res.status(500).json({ success: false });
  }
};

/**
 * GET /api/addon/latest
 */
export const getLatestAddonEmailEntry = async (
  _req: Request,
  res: Response
) => {
  try {
    const latest = await AddonEmailEntry
      .findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!latest) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      data: latest,
    });
  } catch (err) {
    console.error("❌ Addon latest error:", err);
    return res.status(500).json({ success: false });
  }
};
