"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gptController_1 = require("../controllers/gptController");
const router = express_1.default.Router();
router.post("/summary", gptController_1.getBillableSummary);
exports.default = router;
