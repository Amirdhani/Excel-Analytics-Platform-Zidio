import multer from "multer";
import path from "path";
import fs from "fs";

// File type filter (.xls, .xlsx)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".xls", ".xlsx"];
  const ext = path.extname(file.originalname);
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .xls and .xlsx files are allowed"), false);
  }
};

// Get absolute path to uploads folder
const uploadsDir = path.join(process.cwd(), "uploads");

// Ensure the folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, fileFilter });

export default upload;