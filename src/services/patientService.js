import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/patients`;

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
// GET ALL PATIENTS
// ======================================================

export const getPatients = async () => {
  const { data } = await axios.get(
    API,
    authConfig()
  );

  return data.patients;
};

// ======================================================
// CREATE PATIENT
// ======================================================

export const createPatient = async (patient) => {
  const { data } = await axios.post(
    API,
    patient,
    authConfig()
  );

  return data.patient;
};

// ======================================================
// UPDATE PATIENT
// ======================================================

export const updatePatient = async (
  id,
  patient
) => {
  const { data } = await axios.put(
    `${API}/${id}`,
    patient,
    authConfig()
  );

  return data.patient;
};

// ======================================================
// DELETE PATIENT
// ======================================================

export const deletePatient = async (id) => {
  const { data } = await axios.delete(
    `${API}/${id}`,
    authConfig()
  );

  return data;
};

// ======================================================
// GET SINGLE PATIENT
// ======================================================

export const getPatientById = async (id) => {
  const { data } = await axios.get(
    `${API}/${id}`,
    authConfig()
  );

  return data.patient;
};