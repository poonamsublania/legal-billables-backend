import mongoose, { Document, Schema } from "mongoose";

export interface IClioToken extends Document {
  _id: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  clioAccessToken?: string; // original fields
  clioRefreshToken?: string;
  clioTokenExpiry?: number;
  userId?: string;
}

const ClioTokenSchema = new Schema({
  _id: { type: String, default: "singleton" },
  accessToken: { type: String },
  refreshToken: { type: String },
  expiresAt: { type: Date },

  // preserve old fields too
  clioAccessToken: { type: String },
  clioRefreshToken: { type: String },
  clioTokenExpiry: { type: Number },
  userId: { type: String },
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
