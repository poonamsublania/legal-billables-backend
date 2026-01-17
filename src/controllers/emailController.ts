import { Request, Response } from "express";
import EmailEntry from "../models/emailEntry";  // Dashboard entries
import Email from "../models/email";            // Actual emails storage
import { generateGPTEmail } from "../services/geminiService";

// =====================================================
// 🕓 HELPER FUNCTIONS
// =====================================================

// Format date to ISO (SAFE for frontend)

// Format date → DD/MM/YYYY (SAFE + CONSISTENT)
const normalizeDate = (date?: Date | string): string => {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

// =====================================================
// 🕓 HELPERS
// =====================================================

// Date → DD/MM/YYYY
const formatDate = (input?: string | Date) => {
  const d = input ? new Date(input) : new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Seconds → 10s | 2m | 2m 10s
const formatTime = (value?: number | string) => {
  if (!value) return "0s";
  if (typeof value === "string") return value;

  if (value < 60) return `${value}s`;
  const m = Math.floor(value / 60);
  const s = value % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
};



// =====================================================
// 📩 SECTION 1: EMAIL ENTRIES (Dashboard)
// =====================================================

// ➕ Create Email Entry
export const createEmailEntry = async (req: Request, res: Response) => {
  try {
    const { subject, clientEmail, date, trackedTime, status } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: "Subject required" });
    }

    const entry = new EmailEntry({
      subject,
      clientEmail: clientEmail || "Unknown Client",
      date: normalizeDate(date),
      trackedTime:
        typeof trackedTime === "number"
          ? formatTime(trackedTime)
          : trackedTime || "0s",
      status: status === "Pushed" ? "Pushed" : "Pending",
    });

    await entry.save();

    res.status(201).json({
      success: true,
      entry,
    });
  } catch (error: any) {
    console.error("❌ createEmailEntry:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get all Email Entries
export const getAllEmailEntries = async (_req: Request, res: Response) => {
  try {
    const entries = await EmailEntry.find().sort({ date: -1 });
    res.json({ success: true, entries });
  } catch (error: any) {
    console.error("❌ getAllEmailEntries:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Email Entry
export const updateEmailEntry = async (req: Request, res: Response) => {
  try {
    const updated = await EmailEntry.findByIdAndUpdate(
      req.params.id,
      { ...req.body, date: normalizeDate(req.body.date) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Entry not found" });
    }

    res.json({ success: true, entry: updated });
  } catch (error: any) {
    console.error("❌ updateEmailEntry:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// =====================================================
// ❌ DELETE EMAIL ENTRY
// =====================================================
export const deleteEmailEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await EmailEntry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteEmailEntry error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🆕 Get Latest Email Entry (Gmail Add-on / Extension)
export const getLatestEmailEntry = async (_req: Request, res: Response) => {
  try {
    const latest = await EmailEntry.findOne().sort({ date: -1 });

    if (!latest) {
      return res.status(404).json({ success: false, message: "No entries found" });
    }

    res.json({ success: true, entry: latest });
  } catch (error: any) {
    console.error("❌ getLatestEmailEntry:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 📧 SECTION 2: ACTUAL EMAIL STORAGE
// =====================================================

// ➕ Save Email
export const saveEmail = async (req: Request, res: Response) => {
  try {
    const { subject, clientEmail, date, trackedTime } = req.body;

    const email = new Email({
      subject,
      clientEmail: clientEmail || "Unknown Client",
      date: normalizeDate(date),
      trackedTime:
        typeof trackedTime === "number"
          ? formatTime(trackedTime)
          : trackedTime || "0s",
    });

    await email.save();
    res.status(201).json({ success: true, email });
  } catch (error: any) {
    console.error("❌ saveEmail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📬 Get All Emails
export const getAllEmails = async (_req: Request, res: Response) => {
  try {
    const emails = await Email.find().sort({ date: -1 });
    res.json({ success: true, emails });
  } catch (error: any) {
    console.error("❌ getAllEmails:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 🤖 GPT EMAIL GENERATION
// =====================================================

export const getGeneratedEmail = async (req: Request, res: Response) => {
  try {
    const { prompt, thread } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt required" });
    }

    const email = await generateGPTEmail(
      prompt,
      thread || "No previous context"
    );

    res.json({ success: true, email });
  } catch (error: any) {
    console.error("❌ GPT error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
