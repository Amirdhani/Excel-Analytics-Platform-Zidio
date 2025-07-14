import express from "express";
import upload from "../middleware/uploadMiddleware.js";       // Multer setup
import { protect } from "../middleware/authMiddleware.js";    // JWT auth
import xlsx from "xlsx";
import fs from "fs";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const filePath = req.file.path;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Uploaded file not found" });
    }

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: "Excel sheet is empty" });
    }

    const columns = Object.keys(data[0]);

    res.status(200).json({ columns, data });
  } catch (error) {
    console.error("❌ Upload Error:", error.message);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});