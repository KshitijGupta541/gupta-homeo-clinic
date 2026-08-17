import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { updatePatient } from "../../services/patientService";

export default function EditPatientModal({
  isOpen,
  onClose,
  patient,
  onPatientUpdated,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    occupation: "",
    emergencyContact: "",
    allergies: "",
    medicalHistory: "",
    currentMedication: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        fullName: patient.fullName || "",
        age: patient.age || "",
        gender: patient.gender || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        bloodGroup: patient.bloodGroup || "",
        occupation: patient.occupation || "",
        emergencyContact:
          patient.emergencyContact || "",
        allergies: patient.allergies || "",
        medicalHistory:
          patient.medicalHistory || "",
        currentMedication:
          patient.currentMedication || "",
        isActive:
          patient.isActive !== undefined
            ? patient.isActive
            : true,
      });
    }
  }, [patient]);

  if (!isOpen || !patient) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updatePatient(
        patient._id,
        {
          ...formData,
          age: Number(formData.age),
        }
      );

      toast.success(
        "Patient updated successfully."
      );

      onClose();

      if (onPatientUpdated) {
        await onPatientUpdated();
      }
    } catch (error) {
      console.error(
        "Update patient error:",
        error
      );

      if (error.response?.status === 401) {
        toast.error(
          "Your admin session has expired. Please login again."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update patient."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="sticky top-0 bg-white border-b px-6 py-5 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Patient
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Patient ID:{" "}
              <span className="font-semibold text-emerald-600">
                {patient.patientId}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-red-600"
          >
            <X size={22} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          {/* Basic Information */}

          <section>

            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <Input
                label="Age"
                name="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                placeholder="e.g. O+"
              />

              <Input
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />

              <Input
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* Address */}

          <section>

            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Contact Information
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Patient address"
            />

          </section>

          {/* Medical Information */}

          <section>

            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Medical Information
            </h3>

            <div className="space-y-5">

              <TextArea
                label="Allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Known allergies"
              />

              <TextArea
                label="Medical History"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Previous medical conditions or history"
              />

              <TextArea
                label="Current Medication"
                name="currentMedication"
                value={formData.currentMedication}
                onChange={handleChange}
                placeholder="Current medicines"
              />

            </div>

          </section>

          {/* Active Status */}

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">

            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-emerald-600"
            />

            <div>
              <p className="font-semibold text-gray-800">
                Active Patient
              </p>

              <p className="text-sm text-gray-500">
                Enable this if the patient is currently active.
              </p>
            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// ======================================================
// INPUT
// ======================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  min,
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        min={min}
        placeholder={placeholder}
        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />

    </div>
  );
}

// ======================================================
// TEXTAREA
// ======================================================

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        name={name}
        rows="4"
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />

    </div>
  );
}