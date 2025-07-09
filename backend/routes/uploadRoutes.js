import express from "express";
import upload from "../middleware/uploadMiddleware.js";       // Multer setup
import { protect } from "../middleware/authMiddleware.js";    // JWT auth
import xlsx from "xlsx";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), (req, res) => {
  try {
    const filePath = req.file.path;

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const columns = Object.keys(data[0]);

    res.status(200).json({ columns, data });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});

export default router;