import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import TopChart from "../models/TopChart.js";
import FileUploadOnly from "../models/FileUploadOnly.js";

// 1. Get usage stats and store top chart + file uploads
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalUploads = await Analysis.countDocuments();

    const chartStats = await Analysis.aggregate([
      { $match: { chartType: { $in: ["bar", "line", "pie", "scatter"] } } },
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Check for a unique top chart type
    const maxCount = chartStats[0]?.count || 0;
    const topCharts = chartStats.filter(c => c.count === maxCount);

    // Clear previous entries
    await TopChart.deleteMany();
    await FileUploadOnly.deleteMany();

    if (topCharts.length === 1) {
      const topType = topCharts[0]._id;

      const topEntries = await Analysis.find({ chartType: topType })
        .populate("user");

      for (let entry of topEntries) {
        if (entry.user && entry.selectedX && entry.selectedY) {
          await TopChart.create({
            user: entry.user._id,
            selectedX: entry.selectedX,
            selectedY: entry.selectedY,
            chartType: entry.chartType,
            mode: entry.mode?.toUpperCase() || "2D"
          });
        }
      }
    }

    // Store file-only uploads (no chart generated)
    const fileOnlyUploads = await Analysis.find({
      chartType: { $exists: false },
      selectedX: { $exists: false },
      selectedY: { $exists: false }
    });

    for (let file of fileOnlyUploads) {
      await FileUploadOnly.create({
        filename: file.filename || "Untitled",
        uploadedBy: file.user,
        uploadedAt: file.createdAt
      });
    }

    res.json({
      totalUsers,
      totalUploads,
      mostUsedCharts: chartStats
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

// 2. Get all users (admin + user)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 3. Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get all top chart entries
export const getTopCharts = async (req, res) => {
  try {
    const entries = await TopChart.find().populate("user", "name email");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top chart data" });
  }
};

// Get all file-only uploads
export const getFileUploadOnly = async (req, res) => {
  try {
    const entries = await FileUploadOnly.find().populate("uploadedBy", "name email");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch file-only uploads" });
  }
};