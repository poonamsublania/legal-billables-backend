import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  activeCases: { type: Number, default: 0 },
  hoursLogged: { type: Number, default: 0 },
  revenueGenerated: { type: Number, default: 0 }
});

export const TeamMember = mongoose.model("TeamMember", teamSchema);
