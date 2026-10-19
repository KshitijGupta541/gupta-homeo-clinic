
import cloudinary from "../config/cloudinary.js";
import Appointment from "../models/Appointment.js";
import streamifier from "streamifier";

// Upload an image buffer to Cloudinary.
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
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

// Patient submits payment proof.
// Transaction ID is optional, but the screenshot is still required.
export const uploadPaymentProof = async (req, res) => {
  try {
    const { appointmentId, transactionId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a payment screenshot.",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    appointment.paymentStatus = "Pending Verification";
    appointment.paymentAmount = appointment.paymentAmount || 300;
    appointment.paymentMethod = appointment.paymentMethod || "UPI";
    appointment.paymentScreenshot = uploadResult.secure_url;
    appointment.transactionId = transactionId?.trim() || "";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment proof submitted successfully.",
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
    console.error("Payment upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to upload payment proof.",
    });
  }
};

// Admin manually verifies that payment was received.
// A transaction ID or screenshot is not required for manual verification.
export const approvePayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    appointment.paymentStatus = "Paid";
    appointment.paymentVerifiedAt = new Date();
    appointment.paymentRemarks =
      "Payment manually verified by admin.";

    // Do not automatically confirm the appointment here.
    // The admin can confirm it separately in Appointment Management.

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment marked as received.",
      data: appointment,
    });
  } catch (error) {
    console.error("Approve payment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to approve payment.",
    });
  }
};

// Admin rejects a payment submission.
export const rejectPayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    appointment.paymentStatus = "Rejected";
    appointment.paymentVerifiedAt = null;
    appointment.paymentRemarks =
      "Payment submission rejected by admin.";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment rejected.",
      data: appointment,
    });
  } catch (error) {
    console.error("Reject payment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to reject payment.",
    });
  }
};
