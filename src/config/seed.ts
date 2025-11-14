import mongoose from "mongoose";
import dotenv from "dotenv";
import ClientModel from "../models/Client";
import CaseModel from "../models/Case";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("❌ MONGO_URI not defined");

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch(err => console.error(err));

const seed = async () => {
  try {
    await ClientModel.deleteMany({});
    await CaseModel.deleteMany({});

    const clients = await ClientModel.insertMany([
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "Acme Corp", email: "contact@acme.com" }
    ]);

    await CaseModel.insertMany([
      { title: "Contract Review", client: "John Doe", status: "Active", assignedTo: "Alice", hoursLogged: 5, revenueGenerated: 500 },
      { title: "Trademark Filing", client: "Jane Smith", status: "Pending", assignedTo: "Bob", hoursLogged: 2, revenueGenerated: 200 },
      { title: "Legal Consultation", client: "Acme Corp", status: "Closed", assignedTo: "Charlie", hoursLogged: 8, revenueGenerated: 800 },
      { title: "M&A Due Diligence", client: "Acme Corp", status: "Active", assignedTo: "David", hoursLogged: 6, revenueGenerated: 600 }
    ]);

    console.log("✅ Dummy data seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
