import mongoose, { Schema, Document } from "mongoose";

export interface IManualEntry extends Document {
  category: string;
  clientName: string;
  caseName?: string;
  description: string;
  duration: string;
  date: Date;
}

const ManualEntrySchema: Schema = new Schema(
  {
    category: { type: String, required: true },
    clientName: { type: String, required: true },
    caseName: { type: String },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IManualEntry>("ManualEntry", ManualEntrySchema);
