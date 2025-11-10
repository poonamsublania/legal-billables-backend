// backend/src/models/emailEntry.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEmailEntry extends Document {
  subject: string;
  clientEmail: string;
  date: string;
  trackedTime: string;
  status: string;
}

const EmailEntrySchema: Schema = new Schema({
  subject: { type: String, required: true },
  clientEmail: { type: String, required: true },
  date: { type: String, required: true },
  trackedTime: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

export default mongoose.model<IEmailEntry>(
  "EmailEntry", // This must match your MongoDB collection name (Mongoose will pluralize it to 'emailentries')
  EmailEntrySchema
);
