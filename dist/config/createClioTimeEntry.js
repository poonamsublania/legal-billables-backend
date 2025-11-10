"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClioTimeEntry = createClioTimeEntry;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = "https://app.clio.com/api/v4";
async function createClioTimeEntry(accessToken, data) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/time_entries`, {
            description: data.description,
            duration: data.duration,
            matter_id: data.matter_id,
            billable: true,
            ...(data.date && { date: data.date }),
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        console.log("[createClioTimeEntry] Success:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("🔴 Failed to create Clio time entry:", error.response?.data || error.message);
        throw error;
    }
}
