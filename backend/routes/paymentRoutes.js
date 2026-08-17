import express from "express";

import {
  uploadPaymentProof,
  approvePayment,
  rejectPayment,
} from "../controllers/paymentController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// PATIENT PAYMENT PROOF
// ======================================================

// Patient uploads payment screenshot + transaction ID
router.post(
  "/upload",
  upload.single("paymentScreenshot"),
  uploadPaymentProof
);

// ======================================================
// ADMIN PAYMENT VERIFICATION
// ======================================================

// Admin approves payment
router.put(
  "/:appointmentId/approve",
  protect,
  approvePayment
);

// Admin rejects payment
router.put(
  "/:appointmentId/reject",
  protect,
  rejectPayment
);

export default router;