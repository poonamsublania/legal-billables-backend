"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushDraftToClio = exports.deleteDraft = exports.updateDraft = exports.getDrafts = exports.createDraft = void 0;
const draftsService = __importStar(require("../services/draftsService"));
// Create draft
const createDraft = async (req, res) => {
    try {
        const draft = await draftsService.createDraft(req.body);
        res.status(201).json(draft);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create draft", details: err });
    }
};
exports.createDraft = createDraft;
// Get all drafts
const getDrafts = async (_req, res) => {
    try {
        const drafts = await draftsService.getDrafts();
        res.json(drafts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch drafts", details: err });
    }
};
exports.getDrafts = getDrafts;
// Update draft
const updateDraft = async (req, res) => {
    try {
        const updated = await draftsService.updateDraft(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ error: "Draft not found" });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update draft", details: err });
    }
};
exports.updateDraft = updateDraft;
// Delete draft
const deleteDraft = async (req, res) => {
    try {
        const result = await draftsService.deleteDraft(req.params.id);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete draft", details: err });
    }
};
exports.deleteDraft = deleteDraft;
// Push draft to Clio
const pushDraftToClio = async (req, res) => {
    try {
        const draft = await draftsService.pushDraftToClio(req.params.id);
        res.json({ message: "Draft pushed to Clio (simulated)", draft });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to push draft", details: err });
    }
};
exports.pushDraftToClio = pushDraftToClio;
