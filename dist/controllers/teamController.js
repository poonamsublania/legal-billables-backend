"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.createTeamMember = exports.getAllTeamMembers = void 0;
const TeamMember_1 = require("../models/TeamMember"); // ✅ named import
// --------------------
// Get all team members
// --------------------
const getAllTeamMembers = async (req, res) => {
    try {
        const team = await TeamMember_1.TeamMember.find().lean();
        res.json(team);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch team members" });
    }
};
exports.getAllTeamMembers = getAllTeamMembers;
// --------------------
// Create / Update / Delete Team Member
// --------------------
const createTeamMember = async (req, res) => {
    try {
        const member = await TeamMember_1.TeamMember.create(req.body);
        res.json(member);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create team member" });
    }
};
exports.createTeamMember = createTeamMember;
const updateTeamMember = async (req, res) => {
    try {
        const updatedMember = await TeamMember_1.TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update team member" });
    }
};
exports.updateTeamMember = updateTeamMember;
const deleteTeamMember = async (req, res) => {
    try {
        await TeamMember_1.TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: "Team member deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete team member" });
    }
};
exports.deleteTeamMember = deleteTeamMember;
