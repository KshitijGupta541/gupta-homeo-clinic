import { useForm } from "react-hook-form";
import { createPatient } from "../../services/patientService";
import toast from "react-hot-toast";

export default function AddPatientModal({
  isOpen,
  onClose,
  onPatientAdded,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await createPatient(formData);

      toast.success("Patient added successfully!");

      reset();

      onPatientAdded();

      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add patient."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-5">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Add New Patient
            </h2>

            <p className="text-gray-500 mt-1">
              Enter patient details below
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
        >

          {/* Name */}
          <div>
            <label className="font-medium">
              Full Name
            </label>

            <input
              {...register("fullName", {
                required: "Name is required",
              })}
              className="w-full border rounded-xl p-3 mt-2"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.fullName?.message}
            </p>
          </div>

          {/* Age */}
          <div>
            <label className="font-medium">
              Age
            </label>

            <input
              type="number"
              {...register("age", {
                required: "Age is required",
              })}
              className="w-full border rounded-xl p-3 mt-2"
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.age?.message}
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="font-medium">
              Gender
            </label>

            <select
              {...register("gender", {
                required: true,
              })}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium">
              Phone
            </label>

            <input
              {...register("phone", {
                required: "Phone is required",
              })}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="font-medium">
              Blood Group
            </label>

            <select
              {...register("bloodGroup")}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="font-medium">
              Occupation
            </label>

            <input
              {...register("occupation")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="font-medium">
              Emergency Contact
            </label>

            <input
              {...register("emergencyContact")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="font-medium">
              Address
            </label>

            <textarea
              rows="3"
              {...register("address")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Medical History */}
          <div className="md:col-span-2">
            <label className="font-medium">
              Medical History
            </label>

            <textarea
              rows="3"
              {...register("medicalHistory")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Current Medication */}
          <div className="md:col-span-2">
            <label className="font-medium">
              Current Medication
            </label>

            <textarea
              rows="3"
              {...register("currentMedication")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="font-medium">
              Allergies
            </label>

            <textarea
              rows="3"
              {...register("allergies")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              {isSubmitting ? "Saving..." : "Save Patient"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}