"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/log', (req, res) => {
    console.log('Logged billable:', req.body);
    res.json({ success: true });
});
exports.default = router;
