"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTimeEntry = exports.getClioToken = void 0;
// src/services/clioService.ts
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
/**
 * Get Clio access token from DB
 */
const getClioToken = async () => {
    const tokenDoc = await clioToken_1.default.findOne({ _id: "singleton" });
    if (!tokenDoc)
        return null;
    return tokenDoc.accessToken;
};
exports.getClioToken = getClioToken;
/**
 * Push time entry to Clio API
 * @param accessToken Clio API access token
 * @param payload Object containing: description, duration, date, matterId, userId
 */
const logTimeEntry = async (accessToken, payload) => {
    const { description, duration, date, matterId, userId } = payload;
    const data = {
        data: {
            type: "TimeEntry",
            attributes: {
                description,
                duration,
                date,
                matter_id: matterId,
                user_id: userId || undefined,
            },
        },
    };
    try {
        const response = await axios_1.default.post("https://app.clio.com/api/v4/time_entries", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (err) {
        console.error("[ClioService] Error pushing time entry:", err.response?.data || err.message);
        throw new Error(err.response?.data?.error || "Failed to push time entry to Clio");
    }
};
exports.logTimeEntry = logTimeEntry;
