import express from "express";

import {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC
// ======================================================

// Add patient
router.post("/", addPatient);

// ======================================================
// ADMIN
// ======================================================

// View all patients
router.get("/", protect, getPatients);

// View single patient
router.get("/:id", protect, getPatient);

// Update patient
router.put("/:id", protect, updatePatient);

// Delete patient
router.delete("/:id", protect, deletePatient);

export default router;