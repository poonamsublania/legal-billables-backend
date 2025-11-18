"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/billingRoutes.ts
const express_1 = require("express");
const billingController_1 = require("../controllers/billingController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // ✅ Correct import
const router = (0, express_1.Router)();
// 🕒 Log time entry (Requires API Key)
router.post("/time-entry", (0, authMiddleware_1.requireAuth)(), billingController_1.createTimeEntry);
exports.default = router;
