"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "OAuth failed" });
    }
    next();
};
exports.requireAuth = requireAuth;
