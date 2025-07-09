import express from "express";
import Analysis from "../models/Analysis.js";
import upload from "../middleware/uploadMiddleware.js";
import { parseExcel, getUserHistory } from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSingleAnalysis } from "../controllers/analysisController.js";


const router = express.Router();

// Protected route to upload and parse Excel
router.post("/upload", protect, upload.single("file"), parseExcel);
router.get("/history", protect, getUserHistory);
router.get("/history/:id", protect, getSingleAnalysis);


router.delete("/history/:id", protect, async (req, res) => {
  try {
    console.log("User ID:", req.user.id);
    console.log("Delete ID:", req.params.id);

    const record = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

export default router;