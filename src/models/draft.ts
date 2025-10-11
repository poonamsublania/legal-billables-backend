// src/models/draft.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IDraft extends Document {
  emailSubject: string;
  emailBody: string;
  gptSummary: string;
  durationInSeconds: number;
  matterId?: string;
  status: "draft" | "pushed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const draftSchema = new Schema<IDraft>(
  {
    emailSubject: { type: String, required: true },
    emailBody: { type: String, required: true },
    gptSummary: { type: String, required: true },
    durationInSeconds: { type: Number, required: true },
    matterId: { type: String },
    status: { type: String, enum: ["draft", "pushed", "failed"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model<IDraft>("Draft", draftSchema);
