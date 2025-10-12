import { Request, Response } from "express";
import Client from "../models/Client";

// Create client
export const createClient = async (req: Request, res: Response) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: "Failed to create client", details: err });
  }
};

// Get all clients
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients", details: err });
  }
};

// Update client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Client.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update client", details: err });
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete client", details: err });
  }
};
