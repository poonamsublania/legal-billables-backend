import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: Date;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ClientModel = mongoose.model<IClient>("Client", ClientSchema);
export default ClientModel;
