import mongoose from "mongoose";

const billableSchema = new mongoose.Schema({
  summary: String,
  duration: Number,
  userId: String,
  caseId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Billable", billableSchema);
