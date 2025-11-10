import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  subject: String,
  clientEmail: String,
  date: String,
  trackedTime: String,
  status: { type: String, default: "Pending" },
});

export default mongoose.model("Email", emailSchema);
