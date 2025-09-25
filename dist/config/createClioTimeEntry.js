"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClioTimeEntry = createClioTimeEntry;
// src/config/createClioTimeEntry.ts
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = "https://app.clio.com/api/v4";
/**
 * Create a time entry in Clio
 */
async function createClioTimeEntry(accessToken, data) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/time_entries`, {
            description: data.description,
            duration: data.duration,
            matter_id: data.matter_id,
            billable: true,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("🔴 Failed to create Clio time entry:", error.response?.data || error.message);
        throw error;
    }
}
