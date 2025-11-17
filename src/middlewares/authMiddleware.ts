import { Request, Response, NextFunction } from "express";

export function requireAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    console.log("🔐 Incoming Authorization header:", authHeader);
    console.log("🔑 Backend API Key:", process.env.BACKEND_SECRET_KEY);

    if (!authHeader) {
      console.log("❌ No Authorization header received");
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    console.log("🔐 Extracted token:", token);

    if (token !== process.env.BACKEND_SECRET_KEY) {
      console.log("❌ Invalid token provided");
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    console.log("✅ Token matched! Access granted.");
    return next(); // 🔥 MOST IMPORTANT
  };
}
