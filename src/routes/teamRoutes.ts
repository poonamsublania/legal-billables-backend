// backend/src/routes/teamRoutes.ts
import express from "express";
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController";

const router = express.Router();

router.get("/", getAllTeamMembers);
router.post("/", createTeamMember);
router.put("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
