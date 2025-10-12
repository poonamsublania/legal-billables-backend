import mongoose from "mongoose";

export interface ICase {
  name: string;
  description?: string;
}

export interface IClient extends mongoose.Document {
  name: string;
  email?: string;
  cases: ICase[];
}

const CaseSchema = new mongoose.Schema<ICase>({
  name: { type: String, required: true },
  description: { type: String },
});

const ClientSchema = new mongoose.Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String },
  cases: { type: [CaseSchema], default: [] },
});

export default mongoose.model<IClient>("Client", ClientSchema);
