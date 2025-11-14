import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: String,
  email: String,
});

export default mongoose.model("Client", ClientSchema);
