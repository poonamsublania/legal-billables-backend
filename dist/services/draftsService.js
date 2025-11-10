"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushDraftToClio = exports.deleteDraft = exports.updateDraft = exports.getDrafts = exports.createDraft = void 0;
// src/services/draftsService.ts
const Draft_1 = __importDefault(require("../models/Draft"));
// Create a draft
const createDraft = async (data) => {
    const draft = new Draft_1.default(data);
    return await draft.save();
};
exports.createDraft = createDraft;
// Get all drafts
const getDrafts = async () => {
    return await Draft_1.default.find().sort({ createdAt: -1 });
};
exports.getDrafts = getDrafts;
// Update a draft
const updateDraft = async (id, data) => {
    return await Draft_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateDraft = updateDraft;
// Delete a draft
const deleteDraft = async (id) => {
    await Draft_1.default.findByIdAndDelete(id);
    return { message: "Draft deleted" };
};
exports.deleteDraft = deleteDraft;
// Push draft to Clio (simulated)
const pushDraftToClio = async (id) => {
    const draft = await Draft_1.default.findById(id);
    if (!draft)
        throw new Error("Draft not found");
    draft.status = "pushed";
    await draft.save();
    return draft;
};
exports.pushDraftToClio = pushDraftToClio;
