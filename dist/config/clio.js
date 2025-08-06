"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioAccessToken = getClioAccessToken;
exports.createClioTimeEntry = createClioTimeEntry;
exports.getClioMatters = getClioMatters;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CLIO_BASE_URL = "https://app.clio.com";
const API_BASE_URL = "https://app.clio.com/api/v4";
/**
 * Exchange authorization code for access token
 */
async function getClioAccessToken(code) {
    try {
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            code,
            redirect_uri: process.env.CLIO_REDIRECT_URI,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response.data; // returns access_token, refresh_token, etc.
    }
    catch (error) {
        console.error("🔴 Failed to get Clio access token:", error);
        throw error;
    }
}
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
        console.error("🔴 Failed to create Clio time entry:", error);
        throw error;
    }
}
/**
 * Get list of matters for the logged-in user
 */
async function getClioMatters(accessToken) {
    try {
        const response = await axios_1.default.get(`${API_BASE_URL}/matters`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("🔴 Failed to fetch Clio matters:", error);
        throw error;
    }
}
