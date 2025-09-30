"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
/**
 * Middleware to require auth.
 * If `req.headers.authorization` is missing, either:
 *  - return 401 (default behavior)
 *  - OR skip auth if route allows optional auth
 */
const requireAuth = (optional = false) => {
    return (req, res, next) => {
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
exports.requireAuth = requireAuth;
