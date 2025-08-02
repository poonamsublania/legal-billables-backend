import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  name: String,
  clientEmail: String,
  practicePantherId: String
});

export default mongoose.model("Case", caseSchema);
