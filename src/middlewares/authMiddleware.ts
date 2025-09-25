// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to require auth.
 * If `req.headers.authorization` is missing, either:
 *  - return 401 (default behavior)
 *  - OR skip auth if route allows optional auth
 */
export const requireAuth = (optional: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      if (optional) {
        // Skip auth for this route
        return next();
      }
      return res.status(401).json({ error: "OAuth failed" });
    }
    next();
  };
};
