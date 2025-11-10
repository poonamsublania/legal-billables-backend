"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
/**
 * Middleware to require backend API auth.
 * Optionally, later can include Clio token verification.
 */
const requireAuth = (optional = false) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            if (optional)
                return next(); // skip auth for optional routes
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
exports.requireAuth = requireAuth;
