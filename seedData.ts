// backend/seedData.ts
import mongoose from "mongoose";
import ClientModel from "./src/models/Client";
import CaseModel from "./src/models/Case";

// Use your MongoDB Atlas URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://newadmin:poonam1234@cluster0.5xosu.mongodb.net/legalbillables?retryWrites=true&w=majority&appName=Cluster0";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data (optional)
    await ClientModel.deleteMany({});
    await CaseModel.deleteMany({});

    // Insert sample clients
    await ClientModel.insertMany([
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "Acme Corp", email: "contact@acme.com" }
    ]);

    // Insert sample cases
    await CaseModel.insertMany([
      { title: "Contract Review", client: "John Doe", status: "Active", assignedTo: "Alice", hoursLogged: 5, revenueGenerated: 500 },
      { title: "Trademark Filing", client: "Jane Smith", status: "Pending", assignedTo: "Bob", hoursLogged: 2, revenueGenerated: 200 },
      { title: "Legal Consultation", client: "Acme Corp", status: "Closed", assignedTo: "Charlie", hoursLogged: 8, revenueGenerated: 800 },
    ]);

    console.log("✅ Sample clients and cases inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
