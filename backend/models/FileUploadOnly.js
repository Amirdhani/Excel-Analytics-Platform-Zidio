import mongoose from "mongoose";

const fileUploadOnlySchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }, 
});

const FileUploadOnly = mongoose.model("FileUploadOnly", fileUploadOnlySchema);
export default FileUploadOnly;