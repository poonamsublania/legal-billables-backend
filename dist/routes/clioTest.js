"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const ClioToken_1 = __importDefault(require("../models/ClioToken"));
const router = express_1.default.Router();
router.get("/test", async (req, res) => {
    try {
        const tokenDoc = await ClioToken_1.default.findById("singleton");
        if (!tokenDoc) {
            return res.status(400).json({ error: "No Clio token found" });
        }
        const response = await axios_1.default.get("https://app.clio.com/api/v4/users/who_am_i", {
            headers: {
                Authorization: `Bearer ${tokenDoc.accessToken}`,
            },
        });
        return res.json({
            message: "Clio API is Working!",
            user: response.data.data, // ← contains the logged-in user
        });
    }
    catch (err) {
        console.error("Clio API Error:", err?.response?.data || err);
        return res.status(500).json({
            error: "Failed to call Clio API",
            details: err?.response?.data || err?.message,
        });
    }
});
exports.default = router;
