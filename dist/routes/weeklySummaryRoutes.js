"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weeklySummaryController_1 = require("../controllers/weeklySummaryController");
const router = express_1.default.Router();
// --------------------
// 🧠 GPT Weekly Summaries
// --------------------
// ✅ Save a GPT-generated summary
router.post("/", weeklySummaryController_1.saveWeeklySummary);
// ✅ Fetch all summaries grouped by date
router.get("/", weeklySummaryController_1.getWeeklySummaries);
exports.default = router;
