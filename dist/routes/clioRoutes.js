"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clioRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const clioController_1 = require("../controllers/clioController");
const router = (0, express_1.Router)();
// ✅ Correct relative paths
router.post("/time-entry", authMiddleware_1.requireAuth, clioController_1.logTimeEntry);
router.get("/token", (0, authMiddleware_1.requireAuth)(true), clioController_1.getClioToken);
exports.default = router;
