import multer from "multer";
import path from "path";

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

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure uploads/ exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, fileFilter });

export default upload;