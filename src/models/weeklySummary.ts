import mongoose, { Schema, Document } from "mongoose";

export interface IWeeklySummary extends Document {
  clientEmail: string;
  summary: string;
  subject?: string;
  date: string; // "27-11-2025"
  day: string;  // "Monday"
  createdAt?: Date;
  updatedAt?: Date;
}

const WeeklySummarySchema: Schema = new Schema(
  {
    clientEmail: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// OPTIONAL → Nicely formatted date (DD-MM-YYYY)
WeeklySummarySchema.virtual("formattedDate").get(function (this: IWeeklySummary) {
  if (!this.createdAt) return "";
  const d = new Date(this.createdAt);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
});

export default mongoose.model<IWeeklySummary>("WeeklySummary", WeeklySummarySchema);
