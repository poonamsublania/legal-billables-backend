"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const latestEmailController_1 = require("../controllers/latestEmailController");
const addonEmailController_1 = require("../controllers/addonEmailController");
const router = express_1.default.Router();
// GET /api/emails/latest
router.get("/latest", latestEmailController_1.getLatestEmailEntry);
// POST /api/emails/addon  ✅ FIXED
router.post("/addon", addonEmailController_1.saveAddonEmail);
exports.default = router;
