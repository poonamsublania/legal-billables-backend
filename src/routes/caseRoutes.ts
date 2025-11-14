// backend/src/routes/caseRoutes.ts
import express from "express";
import {
  getSummary,
  getClientsCases,
  createCase,
  updateCase,
  deleteCase,
} from "../controllers/caseController";

const router = express.Router();

// Summary
router.get("/summary", getSummary);

// Get all clients + cases
router.get("/", getClientsCases);        // /api/cases
router.get("/clients-cases", getClientsCases); // optional alias

// CRUD Cases
router.post("/", createCase);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);

export default router;
