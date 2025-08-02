import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  accessToken: String,
  refreshToken: String
});

export default mongoose.model("User", userSchema);
