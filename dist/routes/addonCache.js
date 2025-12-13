"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// TEMP memory store (OK for now)
const addonCache = {};
router.post("/addon-cache", (req, res) => {
    const { messageId, trackedTime, summary, email } = req.body;
    addonCache[messageId] = {
        trackedTime,
        summary,
        email
    };
    return res.json({ success: true });
});
router.get("/addon-cache/:messageId", (req, res) => {
    const data = addonCache[req.params.messageId];
    return res.json(data || {});
});
exports.default = router;
