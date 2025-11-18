"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/teamRoutes.ts
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
router.get("/", teamController_1.getAllTeamMembers);
router.post("/", teamController_1.createTeamMember);
router.put("/:id", teamController_1.updateTeamMember);
router.delete("/:id", teamController_1.deleteTeamMember);
exports.default = router;
