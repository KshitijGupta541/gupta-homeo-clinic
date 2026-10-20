import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
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

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    occupation: {
      type: String,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    allergies: {
      type: String,
      default: "",
    },

    medicalHistory: {
      type: String,
      default: "",
    },

    currentMedication: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.pre("save", async function () {
  if (!this.patientId) {
    const count = await mongoose.models.Patient.countDocuments();
    this.patientId = `PAT${String(count + 1).padStart(5, "0")}`;
  }
});

export default mongoose.model("Patient", patientSchema);
