"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/billingRoutes.ts
const express_1 = __importDefault(require("express"));
const billingController_1 = require("../controllers/billingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/time-entry", authMiddleware_1.requireAuth, billingController_1.createTimeEntry);
exports.default = router;
console.log("Billing routes loaded");
