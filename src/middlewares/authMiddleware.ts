// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "OAuth failed" });
  }
  next();
};
