import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: string; // e.g. 'lawyer', 'admin'
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "lawyer" },
});

export default mongoose.model<IUser>("User", UserSchema);
