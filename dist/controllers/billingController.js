"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeEntry = void 0;
const clioService_1 = require("../services/clioService");
const createTimeEntry = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer token
        if (!accessToken)
            return res.status(401).json({ error: "No access token" });
        const { matter_id, user_id, duration, description, date } = req.body;
        const timeEntry = await (0, clioService_1.logTimeEntry)(accessToken, {
            matter_id,
            user_id,
            duration,
            description,
            date
        });
        res.json({ success: true, timeEntry });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to log time entry" });
    }
};
exports.createTimeEntry = createTimeEntry;
