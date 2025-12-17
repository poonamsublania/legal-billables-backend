"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manualController_1 = require("../controllers/manualController");
const router = express_1.default.Router();
// REST style (THIS IS WHAT YOUR FRONTEND EXPECTS)
router.post("/", manualController_1.createManualEntry);
router.get("/", manualController_1.getManualEntries);
router.delete("/:id", manualController_1.deleteManualEntry);
exports.default = router;
