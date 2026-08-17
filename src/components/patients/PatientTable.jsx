import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientTable({
  patients,
  loading,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        Loading patients...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Patient ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Gender</th>
              <th className="px-6 py-4 text-left">Age</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="border-b hover:bg-emerald-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-semibold">
                    {patient.patientId}
                  </td>

                  <td className="px-6 py-4">
                    {patient.fullName}
                  </td>

                  <td className="px-6 py-4">
                    {patient.phone}
                  </td>

                  <td className="px-6 py-4">
                    {patient.gender}
                  </td>

                  <td className="px-6 py-4">
                    {patient.age}
                  </td>

                  <td className="px-6 py-4">
                    {patient.isActive ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">

                      {/* View */}
                      <button
                        onClick={() =>
                          navigate(`/admin/patients/${patient._id}`)
                        }
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="View Patient"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit?.(patient)}
                        className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                        title="Edit Patient"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete?.(patient)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Delete Patient"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}