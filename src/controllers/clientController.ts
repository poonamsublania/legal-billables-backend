// backend/src/controllers/clientController.ts
import { Request, Response } from "express";
import ClientModel from "../models/Client";

// --------------------
// Get all clients
// --------------------
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find().lean();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// --------------------
// Create / Update / Delete Client
// --------------------
export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await ClientModel.create(req.body);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: "Failed to create client" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: "Failed to update client" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    await ClientModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete client" });
  }
};
