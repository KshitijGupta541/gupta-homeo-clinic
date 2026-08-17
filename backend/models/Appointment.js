import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    consultationType: {
      type: String,
      enum: ["Clinic Visit", "Online Consultation"],
      default: "Clinic Visit",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    symptoms: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Payment Information
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Pending Verification",
        "Paid",
        "Rejected",
      ],
      default: "Pending",
    },

    paymentAmount: {
      type: Number,
      default: 300,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Cash", "Other"],
      default: "UPI",
    },

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    paymentVerifiedAt: {
      type: Date,
      default: null,
    },

    paymentRemarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", appointmentSchema);