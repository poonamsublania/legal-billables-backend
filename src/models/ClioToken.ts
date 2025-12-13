import mongoose, { Document } from "mongoose";

export interface IClioToken extends Document {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const ClioTokenSchema = new mongoose.Schema<IClioToken>({
  _id: { type: String, default: "singleton" },
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
