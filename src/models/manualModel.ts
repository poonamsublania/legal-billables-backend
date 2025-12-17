import mongoose from "mongoose";

const ManualSchema = new mongoose.Schema({
  category: String,
  clientName: String,
  caseName: String,
  description: String,
  duration: String,
  timeSpent: Number,
  date: String,
  createdAt: Date,
});

export default mongoose.model("Manual", ManualSchema);
