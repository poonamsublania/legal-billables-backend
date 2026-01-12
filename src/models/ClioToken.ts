import { Schema, model, Document, Types } from "mongoose";

// 📝 Interface for ClioToken document
export interface IClioToken extends Document {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  createdAt: Date;
}

// 🏗 Schema definition
const ClioTokenSchema = new Schema<IClioToken>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresIn: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Export the model
export default model<IClioToken>("ClioToken", ClioTokenSchema);
