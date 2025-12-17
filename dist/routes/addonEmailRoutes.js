"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addonEmailController_1 = require("../controllers/addonEmailController");
const clioPushController_1 = require("../controllers/clioPushController");
const router = express_1.default.Router();
router.post("/addon/save", addonEmailController_1.saveAddonEmailEntry);
router.get("/addon/latest", addonEmailController_1.getLatestAddonEmailEntry);
router.post("/clio/push-time", clioPushController_1.pushToClio);
exports.default = router;
