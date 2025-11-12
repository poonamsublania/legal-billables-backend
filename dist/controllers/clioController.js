"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugToken = exports.getClioToken = exports.logTimeEntry = exports.pushToClio = exports.clioCallback = exports.clioAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CLIO_BASE_URL = "https://app.clio.com";
const CLIENT_ID = process.env.CLIO_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIO_CLIENT_SECRET;
const REDIRECT_URI = process.env.CLIO_REDIRECT_URI;
// ⚠️ Temporary in-memory token storage (resets on restart)
let accessToken = null;
// ---------------------------
// ✅ Step 1: Clio OAuth Login
// ---------------------------
const clioAuth = (req, res) => {
    const authUrl = `${CLIO_BASE_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(authUrl);
};
exports.clioAuth = clioAuth;
// ---------------------------
// ✅ Step 2: Clio OAuth Callback
// ---------------------------
const clioCallback = async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
    }
    try {
        const tokenRes = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code,
        });
        accessToken = tokenRes.data.access_token;
        console.log("✅ Clio access token received:", !!accessToken);
        res.send("✅ Clio authorization successful! You can now push data.");
    }
    catch (err) {
        console.error("❌ Error fetching Clio token:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to get Clio token" });
    }
};
exports.clioCallback = clioCallback;
// ---------------------------
// ✅ Step 3: Push time entry to Clio
// ---------------------------
const pushToClio = async (req, res) => {
    if (!accessToken)
        return res
            .status(401)
            .json({ error: "Not authorized with Clio. Please log in first." });
    const { description, duration, date } = req.body;
    if (!description || !duration || !date) {
        return res.status(400).json({ error: "Missing fields in request body" });
    }
    try {
        const entry = {
            activity: {
                description,
                duration,
                date,
            },
        };
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/api/v4/activities.json`, entry, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        res.json({
            success: true,
            message: "✅ Time entry pushed to Clio successfully",
            data: response.data,
        });
    }
    catch (error) {
        console.error("❌ Failed to push to Clio:", error.response?.data || error.message);
        if (error.response?.status === 401) {
            res.status(401).json({ error: "Access token expired. Please log in again." });
        }
        else {
            res.status(500).json({ error: "Failed to push to Clio" });
        }
    }
};
exports.pushToClio = pushToClio;
// ---------------------------
// ✅ Step 4: Mock local log (for testing without Clio)
// ---------------------------
const logTimeEntry = async (req, res) => {
    const { description, duration, date } = req.body;
    if (!description || !duration || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    res.json({
        success: true,
        message: "🕒 Time entry logged successfully (mock local entry)",
        data: { description, duration, date },
    });
};
exports.logTimeEntry = logTimeEntry;
// ---------------------------
// ✅ Step 5: Get token status
// ---------------------------
const getClioToken = async (req, res) => {
    res.json({
        success: true,
        accessToken: accessToken ? "Token available" : "No token yet",
    });
};
exports.getClioToken = getClioToken;
// ---------------------------
// ✅ Step 6: Debug route (check token)
// ---------------------------
const debugToken = (req, res) => {
    if (!accessToken) {
        return res.status(404).json({
            success: false,
            message: "No access token found. Please log in to Clio first.",
        });
    }
    res.json({
        success: true,
        message: "Access token available",
        tokenPreview: accessToken.substring(0, 10) + "...",
    });
};
exports.debugToken = debugToken;
