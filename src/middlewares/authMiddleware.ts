// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to require backend API auth.
 * Optionally, later can include Clio token verification.
 */
export const requireAuth = (optional: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      if (optional) return next(); // skip auth for optional routes
      return res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
    }

    // Remove 'Bearer ' prefix
    const token = authHeader.replace("Bearer ", "").trim();

    // Check backend API key
    if (token !== process.env.BACKEND_API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }

    // ✅ Passed backend API key check, can attach user info if needed
    // Example: req.user = { id: 'system' };

    next();
  };
};
