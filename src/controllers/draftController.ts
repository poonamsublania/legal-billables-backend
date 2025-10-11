// src/controllers/draftController.ts
import { Request, Response } from "express";
import Draft from "../models/draft";
import { logTimeEntry } from "../services/clioService";

export const createDraft = async (req: Request, res: Response) => {
  try {
    const { emailSubject, emailBody, gptSummary, durationInSeconds, matterId } = req.body;

    const draft = await Draft.create({
      emailSubject,
      emailBody,
      gptSummary,
      durationInSeconds,
      matterId,
      status: "draft",
    });

    res.json({ success: true, draft });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDrafts = async (req: Request, res: Response) => {
  const drafts = await Draft.find().sort({ createdAt: -1 });
  res.json(drafts);
};

export const pushDraftToClio = async (req: Request, res: Response) => {
  try {
    const { draftId } = req.params;
    const draft = await Draft.findById(draftId);
    if (!draft) return res.status(404).json({ message: "Draft not found" });

    const clioResponse = await logTimeEntry({
      matterId: draft.matterId!,
      durationInSeconds: draft.durationInSeconds,
      description: draft.gptSummary,
      date: new Date().toISOString().split("T")[0],
    });

    draft.status = "pushed";
    await draft.save();

    res.json({ success: true, clioResponse });
  } catch (error: any) {
    console.error(error);
    await Draft.findByIdAndUpdate(req.params.draftId, { status: "failed" });
    res.status(500).json({ success: false, message: error.message });
  }
};
