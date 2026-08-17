import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/appointments`;

// ======================================================
// AUTH CONFIG
// ======================================================

const authConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET ALL APPOINTMENTS
// ======================================================

export const getAppointments = async () => {
  const response = await axios.get(
    API_URL,
    authConfig()
  );

  return response.data.data;
};

// ======================================================
// GET SINGLE APPOINTMENT
// ======================================================

export const getAppointmentById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    authConfig()
  );

  return response.data.data;
};

// ======================================================
// CREATE APPOINTMENT
// Public booking
// ======================================================

export const createAppointment = async (
  appointment
) => {
  const response = await axios.post(
    API_URL,
    appointment
  );

  return response.data;
};

// ======================================================
// UPDATE APPOINTMENT
// Admin only
// ======================================================

export const updateAppointment = async (
  id,
  updatedData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    updatedData,
    authConfig()
  );

  return response.data;
};

// ======================================================
// DELETE APPOINTMENT
// Admin only
// ======================================================

export const deleteAppointment = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    authConfig()
  );

  return response.data;
};