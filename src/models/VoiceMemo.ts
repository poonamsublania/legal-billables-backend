import { Schema, model, Document } from "mongoose";

export interface IVoiceMemo extends Document {
  userId: string;
  clientName: string;
  durationMinutes: number;
  transcript: string;
  summary: string;
  audioUrl: string;
  createdAt: Date;
}

const voiceMemoSchema = new Schema<IVoiceMemo>(
  {
    userId: { type: String, required: true },
    clientName: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    transcript: { type: String, required: true },
    summary: { type: String, required: true },
    audioUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IVoiceMemo>("VoiceMemo", voiceMemoSchema);
