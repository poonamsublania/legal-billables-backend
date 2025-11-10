import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  phone?: string;
  outstandingAmount?: number;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    outstandingAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IClient>("Client", ClientSchema);
