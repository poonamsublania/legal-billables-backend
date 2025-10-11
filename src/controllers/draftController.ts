import { Request, Response } from "express";
import Draft from "../models/draft";

// Create a new draft
export const createDraft = async (req: Request, res: Response) => {
  try {
    const draft = new Draft(req.body);
    await draft.save();
    res.status(201).json(draft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create draft" });
  }
};

// Get all drafts
export const getDrafts = async (_req: Request, res: Response) => {
  try {
    const drafts = await Draft.find().sort({ createdAt: -1 });
    res.json(drafts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

// Simulate push to Clio
export const pushDraftToClio = async (req: Request, res: Response) => {
  try {
    const { draftId } = req.params;
    const draft = await Draft.findById(draftId);
    if (!draft) return res.status(404).json({ error: "Draft not found" });

    // Simulate push
    draft.status = "pushed";
    await draft.save();

    res.json({ message: "Draft pushed to Clio (simulated)", draft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to push draft" });
  }
};
