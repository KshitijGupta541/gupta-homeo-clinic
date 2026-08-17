import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById } from "../services/patientService";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Droplets,
  AlertTriangle,
  Pill,
  FileText,
  User,
} from "lucide-react";

export default function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const data = await getPatientById(id);
      setPatient(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        Loading Patient...
      </div>
    );

  if (!patient)
    return (
      <div className="p-10 text-center">
        Patient Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl text-white p-8 shadow-xl">

        <h1 className="text-4xl font-bold">
          {patient.fullName}
        </h1>

        <p className="mt-2 text-emerald-100">
          {patient.patientId}
        </p>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Personal Information
          </h2>

          <div className="space-y-4">

            <div className="flex gap-3">
              <User />
              {patient.gender} • {patient.age} Years
            </div>

            <div className="flex gap-3">
              <Phone />
              {patient.phone}
            </div>

            <div className="flex gap-3">
              <Mail />
              {patient.email || "-"}
            </div>

            <div className="flex gap-3">
              <MapPin />
              {patient.address || "-"}
            </div>

            <div className="flex gap-3">
              <Briefcase />
              {patient.occupation || "-"}
            </div>

            <div className="flex gap-3">
              <Droplets />
              Blood Group : {patient.bloodGroup || "-"}
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Medical Information
          </h2>

          <div className="space-y-5">

            <div>
              <div className="flex gap-2 font-semibold">
                <AlertTriangle />
                Allergies
              </div>

              <p className="mt-2 text-gray-600">
                {patient.allergies || "None"}
              </p>
            </div>

            <div>
              <div className="flex gap-2 font-semibold">
                <FileText />
                Medical History
              </div>

              <p className="mt-2 text-gray-600">
                {patient.medicalHistory || "None"}
              </p>
            </div>

            <div>
              <div className="flex gap-2 font-semibold">
                <Pill />
                Current Medication
              </div>

              <p className="mt-2 text-gray-600">
                {patient.currentMedication || "None"}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Future Modules */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">

          <h2 className="text-xl font-bold">
            Appointments
          </h2>

          <p className="text-gray-500 mt-2">
            Coming Soon
          </p>

        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">

          <h2 className="text-xl font-bold">
            Prescriptions
          </h2>

          <p className="text-gray-500 mt-2">
            Coming Soon
          </p>

        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">

          <h2 className="text-xl font-bold">
            Billing
          </h2>

          <p className="text-gray-500 mt-2">
            Coming Soon
          </p>

        </div>

      </div>

    </div>
  );
}