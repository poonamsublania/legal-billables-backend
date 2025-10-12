import mongoose from "mongoose";

export interface ICase extends mongoose.Document {
  name: string;
  clientId: string;
  description?: string;
}

const CaseSchema = new mongoose.Schema<ICase>({
  name: { type: String, required: true },
  clientId: { type: String, required: true },
  description: { type: String },
});

export default mongoose.model<ICase>("Case", CaseSchema);
