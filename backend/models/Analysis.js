import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: String,
  selectedX: String,
  selectedY: String,
  chartType: String,  // bar, line, pie, 3d, etc.
  chartData: [mongoose.Schema.Types.Mixed],
  mode: {
    type: String,
    enum: ["2d", "3d"],
    default: "2d"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model("Analysis", analysisSchema, "total_uploads");
export default Analysis;