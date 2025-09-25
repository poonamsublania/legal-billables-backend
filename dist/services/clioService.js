"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTimeEntry = void 0;
const axios_1 = __importDefault(require("axios"));
const CLIO_BASE_URL = "https://app.clio.com/api/v4"; // Clio API base
const logTimeEntry = async (accessToken, timeEntryData) => {
    try {
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/activities`, {
            activity: {
                matter_id: timeEntryData.matter_id,
                user_id: timeEntryData.user_id,
                duration: timeEntryData.duration,
                description: timeEntryData.description,
                occurred_at: timeEntryData.date
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Clio time entry error:", error.response?.data || error.message);
        throw error;
    }
};
exports.logTimeEntry = logTimeEntry;
