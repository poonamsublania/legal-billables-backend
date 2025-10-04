import mongoose, { Document, Schema } from "mongoose";

export interface IClioToken extends Document {
  _id: string; // always "singleton"
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

const ClioTokenSchema = new Schema<IClioToken>({
  _id: { type: String, default: "singleton" },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Force Mongoose to use camelCase keys, not snake_case
ClioTokenSchema.set("toJSON", { virtuals: true });
ClioTokenSchema.set("toObject", { virtuals: true });

export default mongoose.model<IClioToken>("ClioToken", ClioTokenSchema);
