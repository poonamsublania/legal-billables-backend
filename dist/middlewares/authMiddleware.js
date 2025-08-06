"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    // Validate token here
    next();
};
exports.authMiddleware = authMiddleware;
