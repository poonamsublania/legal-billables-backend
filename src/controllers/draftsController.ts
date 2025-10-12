// src/controllers/draftsController.ts
import { Request, Response } from "express";
import * as draftsService from "../services/draftsService";

// Create draft
export const createDraft = async (req: Request, res: Response) => {
  try {
    const draft = await draftsService.createDraft(req.body);
    res.status(201).json(draft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create draft", details: err });
  }
};

// Get all drafts
export const getDrafts = async (_req: Request, res: Response) => {
  try {
    const drafts = await draftsService.getDrafts();
    res.json(drafts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch drafts", details: err });
  }
};

// Update draft
export const updateDraft = async (req: Request, res: Response) => {
  try {
    const updated = await draftsService.updateDraft(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Draft not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update draft", details: err });
  }
};

// Delete draft
export const deleteDraft = async (req: Request, res: Response) => {
  try {
    const result = await draftsService.deleteDraft(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete draft", details: err });
  }
};

// Push draft to Clio
export const pushDraftToClio = async (req: Request, res: Response) => {
  try {
    const draft = await draftsService.pushDraftToClio(req.params.id);
    res.json({ message: "Draft pushed to Clio (simulated)", draft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to push draft", details: err });
  }
};

















