// src/models/Draft.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface for TypeScript
export interface IDraft extends Document {
  emailSubject: string;
  emailBody: string;
  gptSummary: string;
  status: "draft" | "pushed";
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema definition
const DraftSchema: Schema<IDraft> = new Schema(
  {
    emailSubject: { type: String, required: true },
    emailBody: { type: String, required: true },
    gptSummary: { type: String, required: true },
    status: { type: String, enum: ["draft", "pushed"], default: "draft" },
  },
  { timestamps: true }
);

// Default export is the model
export default mongoose.model<IDraft>("Draft", DraftSchema);
