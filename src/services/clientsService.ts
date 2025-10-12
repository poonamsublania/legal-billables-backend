import Client, { IClient } from "../models/Client";

// Create client
export const createClient = async (data: Partial<IClient>) => {
  const client = new Client(data);
  return await client.save();
};

// Get all clients
export const getClients = async () => {
  return await Client.find();
};

// Update client
export const updateClient = async (id: string, data: Partial<IClient>) => {
  return await Client.findByIdAndUpdate(id, data, { new: true });
};

// Delete client
export const deleteClient = async (id: string) => {
  await Client.findByIdAndDelete(id);
  return { message: "Client deleted" };
};
