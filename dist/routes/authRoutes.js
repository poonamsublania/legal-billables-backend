"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Step 1: Login redirect to Clio
router.get('/auth/clio/login', authController_1.redirectToClioLogin);
// Step 2: OAuth callback from Clio
router.get('/auth/clio/callback', authController_1.handleClioCallback);
exports.default = router;
