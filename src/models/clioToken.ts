import mongoose, { Schema, Document } from "mongoose";

export interface IClioToken extends Document {
  clioAccessToken: string;
  clioRefreshToken: string;
  clioTokenExpiry: number;
}

const ClioTokenSchema = new Schema<IClioToken>({
  _id: { type: String, default: "singleton" }, // ensures only one record
  clioAccessToken: { type: String, required: true },
  clioRefreshToken: { type: String, required: true },
  clioTokenExpiry: { type: Number, required: true },
});

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);

