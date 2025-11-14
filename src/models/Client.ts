import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Client", clientSchema);
