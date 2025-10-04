import mongoose, { Document, Schema } from "mongoose";

export interface IClioToken extends Document {
  _id: string; // change from ObjectId to string
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const ClioTokenSchema = new Schema<IClioToken>({
  _id: { type: String, default: "singleton" }, // ✅ use string _id
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
