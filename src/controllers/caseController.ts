// backend/src/controllers/caseController.ts
import { Request, Response } from "express";
import CaseModel from "../models/Case";
import ClientModel from "../models/Client";

// --------------------
// Get overall summary
// --------------------
export const getSummary = async (req: Request, res: Response) => {
  try {
    const totalClients = await ClientModel.countDocuments();
    const activeCases = await CaseModel.countDocuments({ status: "Active" });
    const pendingCases = await CaseModel.countDocuments({ status: "Pending" });
    const closedCases = await CaseModel.countDocuments({ status: "Closed" });

    const totalHoursAgg = await CaseModel.aggregate([
      { $group: { _id: null, totalHours: { $sum: "$hoursLogged" } } }
    ]);

    const totalRevenueAgg = await CaseModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$revenueGenerated" } } }
    ]);

    res.json({
      totalClients,
      activeCases,
      pendingCases,
      closedCases,
      totalHours: totalHoursAgg[0]?.totalHours || 0,
      totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

// --------------------
// Get all clients with their cases
// --------------------
export const getClientsCases = async (req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find().lean();

    const clientsWithCases = await Promise.all(
      clients.map(async (client) => {
        const cases = await CaseModel.find({ client: client.name }).lean();
        return {
          ...client,
          totalCases: cases.length,
          cases,
        };
      })
    );

    res.json(clientsWithCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clients with cases" });
  }
};

// --------------------
// Create a new case
// --------------------
export const createCase = async (req: Request, res: Response) => {
  try {
    const { client: clientName } = req.body;

    // Check if client exists; create if not
    let client = await ClientModel.findOne({ name: clientName });
    if (!client) {
      client = await ClientModel.create({
        name: clientName,
        email: `${clientName.toLowerCase().replace(/\s/g, "")}@example.com`,
      });
    }

    const newCase = await CaseModel.create(req.body);

    res.json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create case" });
  }
};

// --------------------
// Update case
// --------------------
export const updateCase = async (req: Request, res: Response) => {
  try {
    const updatedCase = await CaseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update case" });
  }
};

// --------------------
// Delete case
// --------------------
export const deleteCase = async (req: Request, res: Response) => {
  try {
    await CaseModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete case" });
  }
};
