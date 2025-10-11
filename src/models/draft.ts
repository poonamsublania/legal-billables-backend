import mongoose, { Schema, Document } from "mongoose";

export interface IDraft extends Document {
  emailSubject: string;
  emailBody: string;
  gptSummary: string;
  durationInSeconds: number;
  matterId?: string;
  status: "draft" | "pushed";
  createdAt: Date;
}

const DraftSchema: Schema = new Schema({
  emailSubject: { type: String, required: true },
  emailBody: { type: String, required: true },
  gptSummary: { type: String, required: true },
  durationInSeconds: { type: Number, required: true },
  matterId: { type: String },
  status: { type: String, default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDraft>("Draft", DraftSchema);
