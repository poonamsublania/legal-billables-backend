// src/routes/authRoutes.ts
import express from 'express';
import { handleClioCallback, redirectToClioLogin } from '../controllers/authController';

const router = express.Router();

// Step 1: Login redirect to Clio
router.get('/auth/clio/login', redirectToClioLogin);

// Step 2: OAuth callback from Clio
router.get('/auth/clio/callback', handleClioCallback);

export default router;
