// src/models/clioToken.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IClioToken extends Document {
  _id: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null; // timestamp (ms)
}

const ClioTokenSchema = new Schema({
  _id: { type: String, default: "singleton" },

  // FINAL AND ONLY FIELDS
  accessToken: { type: String, default: null },
  refreshToken: { type: String, default: null },
  expiresAt: { type: Number, default: null }, // store as timestamp
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
