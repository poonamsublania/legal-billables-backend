import mongoose, { Schema, Document } from "mongoose";

export interface IClioToken extends Document {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

const ClioTokenSchema = new Schema<IClioToken>(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IClioToken>(
  "ClioToken",
  ClioTokenSchema
);
