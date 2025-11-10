import mongoose, { Schema, Document } from "mongoose";

export interface ICase extends Document {
  name: string;
  client: string;
  status: "Open" | "On Hold" | "Closed";
  owner?: string;
  nextTask?: string;
  createdAt?: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    name: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: String, enum: ["Open", "On Hold", "Closed"], required: true },
    owner: { type: String },
    nextTask: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICase>("Case", CaseSchema);
