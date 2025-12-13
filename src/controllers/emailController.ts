import { Request, Response } from "express";
import EmailEntry from "../models/emailEntry";  // Dashboard entries
import Email from "../models/email";            // Actual emails storage
import { generateGPTEmail } from "../services/openaiService";

// =====================================================
// 🕓 HELPER FUNCTIONS
// =====================================================

// Format date to "DD/MM/YYYY"
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`; // e.g., 10/11/2025
};

// Format tracked time into "Xs" or "Xm Ys"
const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

// =====================================================
// 📩 SECTION 1: EMAIL ENTRIES (Dashboard logging)
// =====================================================

// 📨 Create a new EmailEntry
export const createEmailEntry = async (req: Request, res: Response) => {
  try {
    const { subject, clientEmail, date, trackedTime, status } = req.body;

    if (!subject || subject.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Subject is required" });
    }

    const formattedDate = formatDate(date || new Date());
    const formattedTime =
      typeof trackedTime === "number"
        ? formatTime(trackedTime)
        : trackedTime || "0s";

    const newEntry = new EmailEntry({
      subject,
      clientEmail: clientEmail || "Unknown Client",
      date: formattedDate,
      trackedTime: formattedTime,
      status: status === "Pushed" ? "Pushed" : "Pending",
    });

    await newEntry.save();
    console.log("✅ EmailEntry saved:", newEntry);

    res
      .status(201)
      .json({ success: true, message: "EmailEntry saved", entry: newEntry });
  } catch (error: any) {
    console.error("❌ Error saving EmailEntry:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// 📋 Get all EmailEntries
export const getAllEmailEntries = async (_req: Request, res: Response) => {
  try {
    const entries = await EmailEntry.find().sort({ _id: -1 });
    console.log("📨 Fetched Email Entries:", entries.length);
    res.json(entries);
  } catch (error: any) {
    console.error("❌ Error fetching EmailEntries:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// =====================================================
// 📧 SECTION 2: ACTUAL EMAILS (Backend storage)
// =====================================================

// 💾 Save a new email
export const saveEmail = async (req: Request, res: Response) => {
  try {
    const { subject, clientEmail, date, trackedTime } = req.body;

    if (!subject || subject.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Subject is required" });
    }

    const formattedDate = formatDate(date || new Date());
    const formattedTime =
      typeof trackedTime === "number"
        ? formatTime(trackedTime)
        : trackedTime || "0s";

    const email = new Email({
      subject,
      clientEmail: clientEmail || "Unknown Client",
      date: formattedDate,
      trackedTime: formattedTime,
    });

    await email.save();
    console.log("📨 Saved Email:", email);

    res.status(201).json({ success: true, email });
  } catch (error: any) {
    console.error("❌ Error saving email:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// 📬 Get all emails
export const getAllEmails = async (_req: Request, res: Response) => {
  try {
    const emails = await Email.find().sort({ date: -1 });
    console.log("📤 Fetched Emails:", emails.length);
    res.json({ success: true, emails });
  } catch (error: any) {
    console.error("❌ Error fetching emails:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// =====================================================
// 🤖 SECTION 3: GPT EMAIL GENERATION
// =====================================================

// Generate GPT-based email
export const getGeneratedEmail = async (req: Request, res: Response) => {
  try {
    const { prompt, thread } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const safeThread =
      thread && thread.trim() !== ""
        ? thread
        : "No prior email context provided.";

    const email = await generateGPTEmail(prompt, safeThread);

    console.log("🤖 GPT email generated:", email);

    res.json({ success: true, email });
  } catch (error: any) {
    console.error("❌ GPT Email Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate GPT email",
      error: error.message,
    });
  }
};

// =====================================================
// 🆕 GET LATEST EMAIL ENTRY (For Gmail Add-on / Extension)
// =====================================================
// 📥 Get latest EmailEntry (most recent)
export const getLatestEmail = async (_req: Request, res: Response) => {
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
      entry: latest,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
