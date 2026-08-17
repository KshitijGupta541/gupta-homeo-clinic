import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";

import PatientTable from "../components/patients/PatientTable";
import AddPatientModal from "../components/patients/AddPatientModal";
import EditPatientModal from "../components/patients/EditPatientModal";

import {
  getPatients,
  deletePatient,
} from "../services/patientService";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const data = await getPatients();

      setPatients(data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);

      if (err.response?.status === 401) {
        toast.error(
          "Your admin session has expired. Please login again."
        );
      } else {
        toast.error("Failed to load patients.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  const handleDelete = async (patient) => {
    const confirmDelete = window.confirm(
      `Delete ${patient.fullName}?`
    );

    if (!confirmDelete) return;

    try {
      await deletePatient(patient._id);

      toast.success("Patient deleted successfully.");

      await fetchPatients();
    } catch (err) {
      console.error("Delete patient error:", err);

      if (err.response?.status === 401) {
        toast.error(
          "Your admin session has expired. Please login again."
        );
      } else {
        toast.error("Failed to delete patient.");
      }
    }
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.fullName || ""} ${
      patient.phone || ""
    } ${patient.patientId || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Patients
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all registered patients
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Add Patient
        </button>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by Patient ID, Name or Phone..."
            className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* Patient Table */}

      <PatientTable
        patients={filteredPatients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Patient */}

      <AddPatientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onPatientAdded={fetchPatients}
      />

      {/* Edit Patient */}

      <EditPatientModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onPatientUpdated={fetchPatients}
      />

    </div>
  );
}