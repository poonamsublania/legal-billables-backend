"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_KEY = process.env.GEMINI_API_KEY;
const URL = "https://generativelanguage.googleapis.com/v1beta/models";
(async () => {
    try {
        const res = await (0, node_fetch_1.default)(URL, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
            },
        });
        const data = await res.json();
        console.log("Available models:", data);
    }
    catch (err) {
        console.error("❌ Failed to list models:", err);
    }
})();
