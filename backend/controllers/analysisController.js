import xlsx from "xlsx";
import fs from "fs";
import Analysis from "../models/Analysis.js";

// POST /api/analysis/upload
export const parseExcel = async (req, res) => {
  try {
    const file = req.file;
    const { selectedX, selectedY, chartType } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Read Excel file
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    fs.unlinkSync(file.path); // remove file after processing
    console.log("Parsed Excel JSON data =>", jsonData);


    // Save to history (only metadata for now)
    await Analysis.create({
      user: req.user.id,
      filename: file.originalname,
      selectedX,
      selectedY,
      chartType,
      chartData: jsonData,
      mode: req.body.mode || "2d",
    });

    // Send columns and full data back to frontend
    res.json({
      columns: Object.keys(jsonData[0]),
      data: jsonData
    });

  } catch (err) {
    console.error("Excel Parse Error:", err);
    res.status(500).json({ message: "Failed to parse Excel", error: err.message });
  }
};

// Get upload history for logged-in user
export const getUploadHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const records = await Analysis.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve history" });
  }
};

// Get a single analysis record
export const getSingleAnalysis = async (req, res) => {
  try {
    const record = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!record) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chart details" });
  }
};

export const getAllUploads = async (req, res) => {
  try {
    const uploads = await Analysis.find().populate("user", "email").sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

// Get one upload record (for chart view)
export const getAdminSingleAnalysis = async (req, res) => {
  try {
    const record = await Analysis.findById(req.params.id).populate("user", "email");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analysis", error: err.message });
  }
};
