import Appointment from "../models/Appointment.js";

// Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      paymentAmount: 300,
      paymentMethod: "UPI",
      paymentStatus: "Pending",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const { status } = req.body;

    // Appointment cannot be confirmed before payment verification
    if (
      status === "Confirmed" &&
      appointment.paymentStatus !== "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment cannot be confirmed until payment is verified.",
      });
    }

    // Update status
    if (status !== undefined) {
      appointment.status = status;
    }

    // Update patient information if provided
    if (req.body.fullName !== undefined) {
      appointment.fullName = req.body.fullName;
    }

    if (req.body.phone !== undefined) {
      appointment.phone = req.body.phone;
    }

    if (req.body.email !== undefined) {
      appointment.email = req.body.email;
    }

    if (req.body.age !== undefined) {
      appointment.age = req.body.age;
    }

    if (req.body.gender !== undefined) {
      appointment.gender = req.body.gender;
    }

    if (req.body.consultationType !== undefined) {
      appointment.consultationType =
        req.body.consultationType;
    }

    if (req.body.date !== undefined) {
      appointment.date = req.body.date;
    }

    if (req.body.time !== undefined) {
      appointment.time = req.body.time;
    }

    if (req.body.symptoms !== undefined) {
      appointment.symptoms = req.body.symptoms;
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};