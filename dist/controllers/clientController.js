"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getAllClients = void 0;
const Client_1 = __importDefault(require("../models/Client"));
// --------------------
// Get all clients
// --------------------
const getAllClients = async (req, res) => {
    try {
        const clients = await Client_1.default.find().lean();
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch clients" });
    }
};
exports.getAllClients = getAllClients;
// --------------------
// Create / Update / Delete Client
// --------------------
const createClient = async (req, res) => {
    try {
        const client = await Client_1.default.create(req.body);
        res.json(client);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create client" });
    }
};
exports.createClient = createClient;
const updateClient = async (req, res) => {
    try {
        const updatedClient = await Client_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClient);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update client" });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        await Client_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Client deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete client" });
    }
};
exports.deleteClient = deleteClient;
