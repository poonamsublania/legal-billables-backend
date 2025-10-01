// src/models/clioToken.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IClioToken extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const ClioTokenSchema = new Schema<IClioToken>({
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Use default export for easier imports
const ClioTokenModel = mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
export default ClioTokenModel;
