import mongoose from "mongoose";

const topChartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedX: String,
  selectedY: String,
  chartType: { type: String, enum: ["bar", "line", "pie", "scatter"], required: true },
  mode: { type: String, enum: ["2D", "3D"], default: "2D" },
  createdAt: { type: Date, default: Date.now }
});

const TopChart = mongoose.model("TopChart", topChartSchema);
export default TopChart;