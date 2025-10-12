import mongoose from "mongoose";

export interface IBillable extends mongoose.Document {
  clientId: string;
  caseId: string;
  description: string;
  duration: number; // seconds
  source: "gmail" | "manual";
  date: Date;
}

const BillableSchema = new mongoose.Schema<IBillable>({
  clientId: { type: String, required: true },
  caseId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  source: { type: String, enum: ["gmail", "manual"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IBillable>("Billable", BillableSchema);
