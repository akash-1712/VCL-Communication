import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: "student" | "staff";
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "staff"], required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
