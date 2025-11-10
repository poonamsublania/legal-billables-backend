"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Step 1: Start OAuth with Clio
router.get("/clio/login", authController_1.redirectToClioLogin);
// Step 2: Handle Clio callback
router.get("/clio/callback", authController_1.handleClioCallback);
exports.default = router;
