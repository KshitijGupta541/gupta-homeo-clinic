import cloudinary from "../config/cloudinary.js";
import Appointment from "../models/Appointment.js";
import streamifier from "streamifier";

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gupta-homeo-clinic/payments",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ======================================================
// UPLOAD PAYMENT PROOF
// ======================================================

export const uploadPaymentProof = async (req, res) => {
  try {
    const { appointmentId, transactionId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Upload screenshot to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Update appointment
    appointment.paymentStatus = "Pending Verification";
    appointment.paymentAmount = 300;
    appointment.paymentMethod = "UPI";
    appointment.paymentScreenshot = uploadResult.secure_url;
    appointment.transactionId = transactionId?.trim() || "";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment proof submitted successfully",
      data: {
        appointmentId: appointment._id,
        paymentStatus: appointment.paymentStatus,
        paymentAmount: appointment.paymentAmount,
        paymentMethod: appointment.paymentMethod,
        transactionId: appointment.transactionId,
        paymentScreenshot: appointment.paymentScreenshot,
      },
    });
  } catch (error) {
    console.error("Payment upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload payment proof",
      error: error.message,
    });
  }
};

// ======================================================
// APPROVE PAYMENT
// ======================================================

export const approvePayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "Paid";
    appointment.paymentVerifiedAt = new Date();
    appointment.paymentRemarks = "Payment verified by admin";
    appointment.status = "Confirmed";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment approved and appointment confirmed",
      data: appointment,
    });
  } catch (error) {
    console.error("Approve payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve payment",
      error: error.message,
    });
  }
};

// ======================================================
// REJECT PAYMENT
// ======================================================

export const rejectPayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "Rejected";
    appointment.paymentVerifiedAt = null;
    appointment.paymentRemarks = "Payment proof rejected by admin";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment rejected",
      data: appointment,
    });
  } catch (error) {
    console.error("Reject payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject payment",
      error: error.message,
    });
  }
};