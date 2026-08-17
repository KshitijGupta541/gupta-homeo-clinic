import { useEffect, useState } from "react";
import { CalendarDays, Clock, Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAppointments } from "../../services/appointmentService";

export default function RecentAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const data = await getAppointments();

      // Show latest appointments first
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt || b.date) -
          new Date(a.createdAt || a.date)
      );

      setAppointments(sorted.slice(0, 5));
    } catch (error) {
      console.error(
        "Failed to load recent appointments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending Verification":
        return "bg-orange-100 text-orange-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center">

        <RefreshCw
          size={25}
          className="animate-spin mx-auto text-emerald-600"
        />

        <p className="text-gray-500 mt-2">
          Loading appointments...
        </p>

      </div>
    );
  }

  return (
    <div>

      {/* Appointment List */}

      <div className="space-y-3">

        {appointments.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          appointments.map((appointment) => (

            <div
              key={appointment._id}
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* Patient */}

                <div>

                  <h3 className="font-bold text-gray-800">
                    {appointment.fullName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {appointment.phone}
                  </p>

                </div>

                {/* Date / Time */}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />

                    {new Date(
                      appointment.date
                    ).toLocaleDateString("en-IN")}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} />

                    {appointment.time}
                  </div>

                </div>

                {/* Consultation */}

                <div className="text-sm">

                  <span className="text-gray-500">
                    Consultation
                  </span>

                  <p className="font-semibold mt-1">
                    {appointment.consultationType}
                  </p>

                </div>

                {/* Status */}

                <div className="flex flex-wrap gap-2">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(
                      appointment.paymentStatus
                    )}`}
                  >
                    {appointment.paymentStatus}
                  </span>

                </div>

                {/* View */}

                <button
                  onClick={() =>
                    navigate(
                      `/admin/appointments/${appointment._id}`
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-xl font-medium transition"
                >
                  <Eye size={16} />
                  View
                </button>

              </div>

            </div>

          ))
        )}

      </div>

      {/* View All */}

      {appointments.length > 0 && (
        <div className="mt-5 text-center">

          <button
            onClick={() =>
              navigate("/admin/appointments")
            }
            className="text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            View All Appointments →
          </button>

        </div>
      )}

    </div>
  );
}