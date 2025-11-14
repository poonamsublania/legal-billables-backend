import mongoose, { Document } from "mongoose";

export interface IClioToken extends Document {
  clioAccessToken: string;
  clioRefreshToken: string;
  clioTokenExpiry: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const ClioTokenSchema = new mongoose.Schema<IClioToken>({
  _id: { type: String, default: "singleton" }, // singleton pattern
  clioAccessToken: { type: String, required: true },
  clioRefreshToken: { type: String, required: true },
  clioTokenExpiry: { type: Number, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
