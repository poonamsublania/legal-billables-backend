import { Request, Response } from "express";
import EmailEntry from "../models/emailEntry";

/**
 * GET /api/emails/latest
 * Returns the most recent EmailEntry
 */
export const getLatestEmailEntry = async (
  _req: Request,
  res: Response
) => {
  try {
    const latest = await EmailEntry
      .findOne()
      .sort({ _id: -1 })
      .lean();

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No email entries found",
      });
    }

    // ✅ Normalize response for Gmail Add-on
    const responsePayload = {
      subject: latest.subject || "",
      trackedTime: latest.trackedTime || "0s",

      // 👉 SUMMARY HANDLING (safe + flexible)
      summary:
        (latest as any).summary ||        // if exists
        (latest as any).gptSummary ||     // alternate key
        latest.status ||                  // fallback
        "",

      clientEmail: latest.clientEmail || "",
      date: latest.date || "",
      status: latest.status || "Pending",
    };

    return res.json({
      success: true,
      data: responsePayload,
    });

  } catch (error: any) {
    console.error("❌ Error fetching latest email entry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
