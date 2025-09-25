"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clioRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const clioController_1 = require("../controllers/clioController");
const router = (0, express_1.Router)();
// Endpoint to push tracked time and GPT summary to Clio
router.post("/time-entry", authMiddleware_1.requireAuth, clioController_1.logTimeEntry);
// Optional endpoint for frontend to fetch the current stored Clio token
router.get("/token", authMiddleware_1.requireAuth, clioController_1.getClioToken);
exports.default = router;
