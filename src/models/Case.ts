import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema({
  title: String,
  client: String,
  status: String,
  assignedTo: String,
  hoursLogged: Number,
  revenueGenerated: Number,
});

export default mongoose.model("Case", CaseSchema);
