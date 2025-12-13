"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manualController_1 = require("../controllers/manualController");
const router = express_1.default.Router();
// POST /manual/create
router.post("/create", manualController_1.createManualEntry);
// GET /manual/all
router.get("/all", manualController_1.getManualEntries);
// DELETE /manual/:id
router.delete("/:id", manualController_1.deleteManualEntry);
exports.default = router;
