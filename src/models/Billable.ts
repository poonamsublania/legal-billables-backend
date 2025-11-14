import mongoose, { Schema, Document } from "mongoose";

export interface IBillable extends Document {
  userId: string;
  caseId: string;
  description: string;
  hours: number;
  amount: number;
  date: Date;
}

const BillableSchema = new Schema<IBillable>({
  userId: { type: String, required: true },
  caseId: { type: String, required: true },
  description: { type: String, required: true },
  hours: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IBillable>("Billable", BillableSchema);
