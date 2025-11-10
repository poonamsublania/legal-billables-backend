"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClients = exports.createClient = void 0;
const Client_1 = __importDefault(require("../models/Client"));
// Create client
const createClient = async (req, res) => {
    try {
        const client = new Client_1.default(req.body);
        await client.save();
        res.status(201).json(client);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create client", details: err });
    }
};
exports.createClient = createClient;
// Get all clients
const getClients = async (req, res) => {
    try {
        const clients = await Client_1.default.find();
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch clients", details: err });
    }
};
exports.getClients = getClients;
// Update client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Client_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update client", details: err });
    }
};
exports.updateClient = updateClient;
// Delete client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await Client_1.default.findByIdAndDelete(id);
        res.json({ message: "Client deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete client", details: err });
    }
};
exports.deleteClient = deleteClient;
