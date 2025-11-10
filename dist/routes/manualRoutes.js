"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manualController_1 = require("../controllers/manualController");
const router = express_1.default.Router();
// ✅ Create manual entry
router.post("/", manualController_1.createManualEntry);
// ✅ Get all entries
router.get("/", manualController_1.getManualEntries);
// ✅ Delete manual entry
router.delete("/:id", manualController_1.deleteManualEntry);
exports.default = router;
