import mongoose, { Schema, Document } from "mongoose";

export interface IBillable extends Document {
  client: string;
  date: Date;
  duration: number; // in seconds
  status: "Draft" | "Sent" | "Partially Paid" | "Overdue";
}

const BillableSchema = new Schema<IBillable>(
  {
    client: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Partially Paid", "Overdue"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBillable>("Billable", BillableSchema);
