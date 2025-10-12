// src/services/draftsService.ts
import Draft, { IDraft } from "../models/Draft";

// Create a draft
export const createDraft = async (data: Partial<IDraft>): Promise<IDraft> => {
  const draft = new Draft(data);
  return await draft.save();
};

// Get all drafts
export const getDrafts = async (): Promise<IDraft[]> => {
  return await Draft.find().sort({ createdAt: -1 });
};

// Update a draft
export const updateDraft = async (id: string, data: Partial<IDraft>): Promise<IDraft | null> => {
  return await Draft.findByIdAndUpdate(id, data, { new: true });
};

// Delete a draft
export const deleteDraft = async (id: string): Promise<{ message: string }> => {
  await Draft.findByIdAndDelete(id);
  return { message: "Draft deleted" };
};

// Push draft to Clio (simulated)
export const pushDraftToClio = async (id: string): Promise<IDraft> => {
  const draft = await Draft.findById(id);
  if (!draft) throw new Error("Draft not found");

  draft.status = "pushed";
  await draft.save();
  return draft;
};
