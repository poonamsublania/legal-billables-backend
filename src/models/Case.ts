// src/models/Case.ts
import mongoose, { Document } from "mongoose";

// ✅ Add TS interface (matches your current schema)
export interface ICase extends Document {
  title: string;
  client: string;
  status: string;
  assignedTo: string;
  hoursLogged: number;
  revenueGenerated: number;
}

const CaseSchema = new mongoose.Schema({
  title: String,
  client: String,
  status: String,
  assignedTo: String,
  hoursLogged: Number,
  revenueGenerated: Number,
});

// ✅ Export model + interface
export default mongoose.model<ICase>("Case", CaseSchema);
