import mongoose from "mongoose";

const ManualSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    timeSpent: { type: Number, required: true }, // stored in seconds
    clioMatterId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ManualEntry", ManualSchema);
