"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClioCallback = exports.redirectToClioLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
// --------------------------
// Step 1: Redirect user to Clio OAuth
// --------------------------
const redirectToClioLogin = (req, res) => {
    const { CLIO_CLIENT_ID, CLIO_REDIRECT_URI } = process.env;
    if (!CLIO_CLIENT_ID || !CLIO_REDIRECT_URI) {
        return res.status(500).send("❌ Clio client ID or redirect URI not set");
    }
    const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${CLIO_CLIENT_ID}&redirect_uri=${encodeURIComponent(CLIO_REDIRECT_URI)}&scope=read write openid profile email`;
    console.log("🌍 Redirecting to Clio:", authURL);
    res.redirect(authURL);
};
exports.redirectToClioLogin = redirectToClioLogin;
const handleClioCallback = async (req, res) => {
    const code = req.query.code;
    if (!code)
        return res.status(400).send("❌ Missing Clio OAuth code");
    const { CLIO_CLIENT_ID, CLIO_CLIENT_SECRET, CLIO_REDIRECT_URI } = process.env;
    if (!CLIO_CLIENT_ID || !CLIO_CLIENT_SECRET || !CLIO_REDIRECT_URI) {
        return res.status(500).send("❌ Clio environment variables missing");
    }
    try {
        // Use Basic Auth for client credentials
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", CLIO_REDIRECT_URI);
        const response = await axios_1.default.post("https://app.clio.com/oauth/token", params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            auth: {
                username: CLIO_CLIENT_ID,
                password: CLIO_CLIENT_SECRET,
            },
        });
        const { access_token, refresh_token, expires_in } = response.data;
        // Save token in MongoDB
        const savedToken = await clioToken_1.default.findOneAndUpdate({ _id: "singleton" }, {
            clioAccessToken: access_token,
            clioRefreshToken: refresh_token,
            clioTokenExpiry: Date.now() + expires_in * 1000,
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        console.log("✅ Clio token saved:", savedToken);
        // Return HTML to close window & store token in Chrome extension
        res.send(`
      <html>
        <body>
          <script>
            if (typeof chrome !== "undefined" && chrome.storage) {
              chrome.storage.local.set({ clioAccessToken: "${access_token}" }, () => {
                alert("Clio connected successfully!");
                window.close();
              });
            } else {
              alert("Clio connected! You can close this window.");
            }
          </script>
        </body>
      </html>
    `);
    }
    catch (err) {
        console.error("❌ Clio token exchange failed:", err?.response?.data || err.message);
        res.status(500).send("❌ Clio OAuth failed. Check server logs for details.");
    }
};
exports.handleClioCallback = handleClioCallback;
