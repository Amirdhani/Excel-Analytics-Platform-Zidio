import User from "../models/User.js";
import Analysis from "../models/Analysis.js";

// 1. Get usage stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalUploads = await Analysis.countDocuments();

    const chartStats = await Analysis.aggregate([
      { $match: { chartType: { $in: ["bar", "line", "pie", "scatter"] } } },
      { $group: { _id: "$chartType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalUploads,
      mostUsedCharts: chartStats
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

// 2. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 3. Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};