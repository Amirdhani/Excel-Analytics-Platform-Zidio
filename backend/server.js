import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/user.js";
import fileRoutes from "./routes/fileRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analysisRoutes from './routes/analysisRoutes.js';

import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173" // ✅ for local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

console.log("🌍 Allowed CORS Origin:", process.env.CLIENT_URL);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/files", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/analysis', analysisRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Excel Analytics Platform Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});