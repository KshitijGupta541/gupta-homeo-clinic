import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Check,
  CheckCircle,
  X,
  Trash2,
  Eye,
  RefreshCw,
  CalendarDays,
  Clock,
  User,
  Phone,
  CreditCard,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [processing, setProcessing] = useState(null);

  // ======================================================
  // AUTH CONFIG
  // ======================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ======================================================
  // FETCH APPOINTMENTS
  // ======================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/appointments`
      );

      setAppointments(response.data?.data || []);
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );

      alert("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ======================================================
  // UPDATE STATUS
  // ======================================================

  const handleStatus = async (id, status) => {
    try {
      setProcessing(id);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin session expired. Please login again.");
        return;
      }

      await axios.put(
        `${API_URL}/appointments/${id}`,
        { status },
        getAuthConfig()
      );

      await fetchAppointments();

      if (selectedAppointment?._id === id) {
        const updated = appointments.find(
          (appointment) => appointment._id === id
        );

        if (updated) {
          setSelectedAppointment({
            ...updated,
            status,
          });
        }
      }
    } catch (error) {
      console.error(
        "Unable to update appointment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setProcessing(null);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this appointment permanently?"
    );

    if (!confirmed) return;

    try {
      setProcessing(id);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin session expired. Please login again.");
        return;
      }

      await axios.delete(
        `${API_URL}/appointments/${id}`,
        getAuthConfig()
      );

      setSelectedAppointment(null);

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Unable to delete appointment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete appointment."
      );
    } finally {
      setProcessing(null);
    }
  };

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        appointment.fullName
          ?.toLowerCase()
          .includes(query) ||
        appointment.phone
          ?.toLowerCase()
          .includes(query) ||
        appointment.email
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    appointments,
    search,
    statusFilter,
  ]);

  // ======================================================
  // STATUS COLORS
  // ======================================================

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

  // ======================================================
  // PAYMENT COLORS
  // ======================================================

  const getPaymentColor = (payment) => {
    switch (payment) {
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

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

        <RefreshCw
          size={30}
          className="animate-spin mx-auto text-emerald-600"
        />

        <p className="text-gray-500 mt-3">
          Loading appointments...
        </p>

      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}

        <div className="p-6 border-b">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Appointments
              </h2>

              <p className="text-gray-500 mt-1">
                Manage patient appointments
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition self-start"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

          </div>

          {/* SEARCH + FILTER */}

          <div className="flex flex-col md:flex-row gap-3 mt-6">

            <div className="flex items-center border rounded-xl px-4 py-3 flex-1">

              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                className="ml-3 outline-none w-full"
                placeholder="Search by patient, phone or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-xl px-4 py-3 outline-none"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Patient
                </th>

                <th className="p-4 text-left">
                  Appointment
                </th>

                <th className="p-4 text-left">
                  Consultation
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Payment
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAppointments.map(
                (appointment) => (

                  <tr
                    key={appointment._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* PATIENT */}

                    <td className="p-4">

                      <p className="font-semibold text-gray-800">
                        {appointment.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {appointment.phone}
                      </p>

                    </td>

                    {/* DATE / TIME */}

                    <td className="p-4">

                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays size={15} />
                        {new Date(
                          appointment.date
                        ).toLocaleDateString("en-IN")}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock size={15} />
                        {appointment.time}
                      </div>

                    </td>

                    {/* CONSULTATION */}

                    <td className="p-4">

                      <span className="text-sm">
                        {appointment.consultationType}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>

                    </td>

                    {/* PAYMENT */}

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(
                          appointment.paymentStatus
                        )}`}
                      >
                        {appointment.paymentStatus}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="flex justify-center gap-2 flex-wrap">

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            setSelectedAppointment(
                              appointment
                            )
                          }
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        {/* CONFIRM */}

                        <button
                          disabled={
                            processing ===
                            appointment._id ||
                            appointment.paymentStatus !==
                              "Paid"
                          }
                          onClick={() =>
                            handleStatus(
                              appointment._id,
                              "Confirmed"
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg"
                          title={
                            appointment.paymentStatus !==
                            "Paid"
                              ? "Payment must be verified first"
                              : "Confirm"
                          }
                        >
                          <Check size={16} />
                        </button>

                        {/* COMPLETE */}

                        <button
                          disabled={
                            processing ===
                            appointment._id
                          }
                          onClick={() =>
                            handleStatus(
                              appointment._id,
                              "Completed"
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg"
                          title="Complete"
                        >
                          <CheckCircle size={16} />
                        </button>

                        {/* CANCEL */}

                        <button
                          disabled={
                            processing ===
                            appointment._id
                          }
                          onClick={() =>
                            handleStatus(
                              appointment._id,
                              "Cancelled"
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white p-2 rounded-lg"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>

                        {/* DELETE */}

                        <button
                          disabled={
                            processing ===
                            appointment._id
                          }
                          onClick={() =>
                            handleDelete(
                              appointment._id
                            )
                          }
                          className="bg-gray-700 hover:bg-black disabled:bg-gray-400 text-white p-2 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

              {filteredAppointments.length === 0 && (
                <tr>

                  <td
                    colSpan={6}
                    className="p-12 text-center text-gray-500"
                  >
                    No appointments found.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          APPOINTMENT DETAILS MODAL
      ================================================== */}

      {selectedAppointment && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="p-6 border-b flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Appointment Details
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Complete patient appointment information
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ×
              </button>

            </div>

            {/* DETAILS */}

            <div className="p-6 space-y-5">

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={16} />
                    Patient
                  </div>

                  <p className="font-semibold mt-1">
                    {selectedAppointment.fullName}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={16} />
                    Phone
                  </div>

                  <p className="font-semibold mt-1">
                    {selectedAppointment.phone}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-gray-500 text-sm">
                    Email
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    {selectedAppointment.email ||
                      "Not provided"}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-gray-500 text-sm">
                    Age / Gender
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedAppointment.age} /{" "}
                    {selectedAppointment.gender}
                  </p>

                </div>

              </div>

              {/* APPOINTMENT */}

              <div className="bg-blue-50 rounded-2xl p-5">

                <h3 className="font-bold text-gray-800 mb-3">
                  Appointment
                </h3>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">

                  <div>
                    <span className="text-gray-500">
                      Date
                    </span>

                    <p className="font-semibold">
                      {new Date(
                        selectedAppointment.date
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Time
                    </span>

                    <p className="font-semibold">
                      {selectedAppointment.time}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Consultation
                    </span>

                    <p className="font-semibold">
                      {selectedAppointment.consultationType}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Status
                    </span>

                    <p className="font-semibold">
                      {selectedAppointment.status}
                    </p>
                  </div>

                </div>

              </div>

              {/* SYMPTOMS */}

              <div>

                <h3 className="font-bold text-gray-800 mb-2">
                  Symptoms / Problem
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-6">
                  {selectedAppointment.symptoms ||
                    "No symptoms provided."}
                </div>

              </div>

              {/* PAYMENT */}

              <div className="bg-emerald-50 rounded-2xl p-5">

                <div className="flex items-center gap-2">
                  <CreditCard
                    size={18}
                    className="text-emerald-700"
                  />

                  <h3 className="font-bold text-gray-800">
                    Payment
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">

                  <div>
                    <span className="text-gray-500">
                      Amount
                    </span>

                    <p className="font-bold text-emerald-700">
                      ₹
                      {selectedAppointment.paymentAmount ||
                        300}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Method
                    </span>

                    <p className="font-semibold">
                      {selectedAppointment.paymentMethod ||
                        "UPI"}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Payment Status
                    </span>

                    <p className="font-semibold">
                      {selectedAppointment.paymentStatus}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500">
                      Transaction ID
                    </span>

                    <p className="font-mono text-sm break-all">
                      {selectedAppointment.transactionId ||
                        "Not provided"}
                    </p>
                  </div>

                </div>

              </div>

              {/* MODAL ACTIONS */}

              <div className="flex flex-wrap gap-3 pt-2">

                <button
                  disabled={
                    processing ===
                      selectedAppointment._id ||
                    selectedAppointment.paymentStatus !==
                      "Paid"
                  }
                  onClick={() =>
                    handleStatus(
                      selectedAppointment._id,
                      "Confirmed"
                    )
                  }
                  className="flex-1 min-w-[130px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold"
                >
                  Confirm
                </button>

                <button
                  disabled={
                    processing ===
                    selectedAppointment._id
                  }
                  onClick={() =>
                    handleStatus(
                      selectedAppointment._id,
                      "Completed"
                    )
                  }
                  className="flex-1 min-w-[130px] bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold"
                >
                  Complete
                </button>

                <button
                  disabled={
                    processing ===
                    selectedAppointment._id
                  }
                  onClick={() =>
                    handleStatus(
                      selectedAppointment._id,
                      "Cancelled"
                    )
                  }
                  className="flex-1 min-w-[130px] bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}