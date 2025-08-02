"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClioTimeEntry = void 0;
// src/services/clioService.ts
const axios_1 = __importDefault(require("axios"));
const CLIO_API_URL = "https://app.clio.com/api/v4/time_entries"; // Clio v4 endpoint
const createClioTimeEntry = async (accessToken, description, durationInSeconds, matterId) => {
    try {
        const response = await axios_1.default.post(CLIO_API_URL, {
            time_entry: {
                description,
                duration: durationInSeconds,
                matter_id: matterId,
                billed: false,
            },
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Clio entry created:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("❌ Failed to create Clio entry:", error.response?.data || error.message);
        throw new Error("Clio time entry failed");
    }
};
exports.createClioTimeEntry = createClioTimeEntry;
