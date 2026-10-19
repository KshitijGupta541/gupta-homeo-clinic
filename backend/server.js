import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gupta Homeo Clinic API Running 🚀",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Server startup failed:", error.message);
  process.exit(1);
}
