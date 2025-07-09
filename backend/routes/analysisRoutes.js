import express from 'express';
import multer from 'multer';
import { parseExcel, getAllUploads } from '../controllers/analysisController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), parseExcel);
router.get("/", protect, isAdmin, getAllUploads);

export default router;