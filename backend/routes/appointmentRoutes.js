import express from "express";

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC
// ======================================================

// Patient books appointment
router.post("/", createAppointment);

// ======================================================
// APPOINTMENT VIEW
// ======================================================

router.get("/", getAppointments);

router.get("/:id", getAppointmentById);

// ======================================================
// ADMIN ONLY
// ======================================================

// Update appointment
router.put(
  "/:id",
  protect,
  updateAppointment
);

// Delete appointment
router.delete(
  "/:id",
  protect,
  deleteAppointment
);

export default router;