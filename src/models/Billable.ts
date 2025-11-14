import mongoose, { Document, Schema } from "mongoose";

export interface IBillable extends Document {
  userEmail: string;
  clientEmail: string;
  summary: string;
  duration: number;   // ← add
  status: string;     // ← add
  date: Date;
}

const BillableSchema = new Schema<IBillable>({
  userEmail: { type: String, required: true },
  clientEmail: { type: String, required: true },
  summary: { type: String },
  duration: { type: Number, required: true }, // ← add
  status: { type: String, default: "completed" }, // ← add
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IBillable>("Billable", BillableSchema);
