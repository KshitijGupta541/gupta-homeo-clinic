import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updatePatient } from "../../services/patientService";
import toast from "react-hot-toast";

export default function EditPatientModal({
  isOpen,
  onClose,
  patient,
  onPatientUpdated,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  useEffect(() => {
    if (patient) {
      reset(patient);
    }
  }, [patient, reset]);

  const onSubmit = async (formData) => {
    try {
      await updatePatient(patient._id, formData);

      toast.success("Patient updated successfully!");

      onPatientUpdated();

      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update patient."
      );
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">

        <div className="flex justify-between items-center border-b px-6 py-5">
          <div>
            <h2 className="text-3xl font-bold">
              Edit Patient
            </h2>

            <p className="text-gray-500">
              Update patient information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
        >

          <div>
            <label>Full Name</label>
            <input
              {...register("fullName", {
                required: "Required",
              })}
              className="w-full border rounded-xl p-3 mt-2"
            />
            <p className="text-red-500 text-sm">
              {errors.fullName?.message}
            </p>
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              {...register("age", {
                required: "Required",
              })}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              {...register("gender")}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Phone</label>
            <input
              {...register("phone")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              {...register("email")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label>Blood Group</label>
            <input
              {...register("bloodGroup")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label>Occupation</label>
            <input
              {...register("occupation")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label>Emergency Contact</label>
            <input
              {...register("emergencyContact")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label>Address</label>
            <textarea
              rows={3}
              {...register("address")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label>Medical History</label>
            <textarea
              rows={3}
              {...register("medicalHistory")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label>Current Medication</label>
            <textarea
              rows={3}
              {...register("currentMedication")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label>Allergies</label>
            <textarea
              rows={3}
              {...register("allergies")}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700"
            >
              {isSubmitting ? "Updating..." : "Update Patient"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}