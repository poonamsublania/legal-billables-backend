"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/caseRoutes.ts
const express_1 = __importDefault(require("express"));
const caseController_1 = require("../controllers/caseController");
const router = express_1.default.Router();
// Summary
router.get("/summary", caseController_1.getSummary);
// Get all clients + cases
router.get("/", caseController_1.getClientsCases); // /api/cases
router.get("/clients-cases", caseController_1.getClientsCases); // optional alias
// CRUD Cases
router.post("/", caseController_1.createCase);
router.put("/:id", caseController_1.updateCase);
router.delete("/:id", caseController_1.deleteCase);
exports.default = router;
