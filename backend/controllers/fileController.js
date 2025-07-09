import xlsx from "xlsx";
import fs from "fs";
import Analysis from "../models/Analysis.js";

export const parseExcel = async (req, res) => {
  try {
    const file = req.file;
    const { selectedX, selectedY, chartType } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const fullData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Remove the uploaded file from the server
    fs.unlinkSync(file.path);

    // Save upload and chart metadata to DB
    await Analysis.create({
      user: req.user.id,
      fileName: file.originalname,
      selectedX,
      selectedY,
      chartType
    });

    // Filter the Excel data to only selected X and Y columns
    const filteredData = fullData.map(row => ({
      [selectedX]: row[selectedX],
      [selectedY]: row[selectedY]
    }));

    res.json({
      columns: [selectedX, selectedY],
      data: filteredData
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to parse Excel", error: err.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};