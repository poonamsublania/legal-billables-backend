"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientsController_1 = require("../controllers/clientsController");
const router = express_1.default.Router();
// CRUD routes
router.post("/", clientsController_1.createClient);
router.get("/", clientsController_1.getClients);
router.put("/:id", clientsController_1.updateClient);
router.delete("/:id", clientsController_1.deleteClient);
exports.default = router;
