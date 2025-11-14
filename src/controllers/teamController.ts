// backend/src/controllers/teamController.ts
import { Request, Response } from "express";
import { TeamMember } from "../models/TeamMember"; // ✅ named import

// --------------------
// Get all team members
// --------------------
export const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    const team = await TeamMember.find().lean();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

// --------------------
// Create / Update / Delete Team Member
// --------------------
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await TeamMember.create(req.body);
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team member" });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const updatedMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: "Failed to update team member" });
  }
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete team member" });
  }
};
