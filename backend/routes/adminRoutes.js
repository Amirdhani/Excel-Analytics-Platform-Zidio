import express from "express";
import {
  getStats,
  getAllUsers,
  deleteUser,
  getTopCharts,
  getFileUploadOnly
} from "../controllers/adminController.js";

import { getAllUploads, getAdminSingleAnalysis } from "../controllers/analysisController.js"; // ✅ import here
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.get("/analysis", protect, isAdmin, getAllUploads); 
router.get("/analysis/:id", protect, isAdmin, getAdminSingleAnalysis);

router.get("/top-charts", protect, isAdmin, getTopCharts);
router.get("/file-uploads", protect, isAdmin, getFileUploadOnly);


export default router;