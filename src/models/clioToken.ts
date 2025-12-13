import mongoose from "mongoose";

const ClioTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ClioToken", ClioTokenSchema);
