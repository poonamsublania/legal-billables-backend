"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClients = exports.createClient = void 0;
const Client_1 = __importDefault(require("../models/Client"));
// Create client
const createClient = async (data) => {
    const client = new Client_1.default(data);
    return await client.save();
};
exports.createClient = createClient;
// Get all clients
const getClients = async () => {
    return await Client_1.default.find();
};
exports.getClients = getClients;
// Update client
const updateClient = async (id, data) => {
    return await Client_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateClient = updateClient;
// Delete client
const deleteClient = async (id) => {
    await Client_1.default.findByIdAndDelete(id);
    return { message: "Client deleted" };
};
exports.deleteClient = deleteClient;
