"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gptController_1 = require("../controllers/gptController");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
router.post("/summary", gptController_1.getBillableSummary);
router.post("/email", emailController_1.getGeneratedEmail); // ✅ directly here
exports.default = router;
