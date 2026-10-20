import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable. Please try again shortly.",
    });
  }

  next();
});

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gupta Homeo Clinic API Running 🚀",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    success: connected,
    database: connected ? "connected" : "unavailable",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not configured.");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

let retryDelay = 5000;

const connectWithRetry = async () => {
  try {
    await connectDB();
    retryDelay = 5000;
  } catch (error) {
    console.error(
      `❌ MongoDB unavailable. Retrying in ${retryDelay / 1000} seconds.`
    );

    setTimeout(connectWithRetry, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 60000);
  }
};

connectWithRetry();
