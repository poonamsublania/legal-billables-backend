// src/models/ClioToken.ts
import { Schema, model } from "mongoose";

// ✅ Plain interface (DO NOT extend Document)
export interface IClioToken {
  _id: string;           // singleton ID
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClioTokenSchema = new Schema<IClioToken>(
  {
    _id: {
      type: String,
      default: "singleton",
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: new Date(0), // expired by default
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ✅ Typed model
const ClioTokenModel = model<IClioToken>("ClioToken", ClioTokenSchema);
export default ClioTokenModel;
