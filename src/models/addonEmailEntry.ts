import mongoose, { Schema, Document } from "mongoose";

export interface IAddonEmailEntry extends Document {
  subject: string;
  clientEmail: string;
  date: string;
  trackedTime: string;
  quantity: string;
  summary: string;
  status: string;
  createdAt: Date;
}

const AddonEmailEntrySchema = new Schema<IAddonEmailEntry>(
  {
    subject: { type: String, default: "" },
    clientEmail: { type: String, default: "Unknown Client" },
    date: { type: String, default: "" },
    trackedTime: { type: String, default: "" },
    quantity: { type: String, default: ""},

    summary: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "addon_email_entries" }
);

export default mongoose.model<IAddonEmailEntry>(
  "AddonEmailEntry",
  AddonEmailEntrySchema
);
