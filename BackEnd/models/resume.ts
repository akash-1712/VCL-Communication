import mongoose, { Document, Model, Schema, Types } from "mongoose";

interface IResume extends Document {
  studentId: Types.ObjectId | undefined;
  name: string;
  email: string;
  contactNumber: string;
  resumeUrl: string;
  uploadDate: Date;
  publicId: string;
}

const resumeSchema = new Schema<IResume>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    publicId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Resume: Model<IResume> = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
