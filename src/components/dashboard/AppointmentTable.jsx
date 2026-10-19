
import { useCallback, useEffect, useMemo, useState } from "react";
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
  Pencil,
  AlertCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://gupta-homeo-clinic.onrender.com/api"
).replace(/\/+$/, "");

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

function getStatusColor(status) {
  switch (status) {
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

function getPaymentColor(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";
    case "Pending Verification":
      return "bg-orange-100 text-orange-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");

    return {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    };
  }, []);

  const fetchAppointments = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/appointments`,
        getAuthConfig()
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.appointments)
            ? data.appointments
            : [];

      setAppointments(list);

      setSelectedAppointment((current) => {
        if (!current) return null;

        return list.find((item) => item._id === current._id) || null;
      });
    } catch (err) {
      console.error(
        "Failed to load appointments:",
        err.response?.data || err.message
      );

      setError(
        err.response?.status === 401
          ? "Your admin session may have expired. Please log in again."
          : err.response?.data?.message ||
              "Unable to load appointments. Check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAuthConfig]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (id, status) => {
    const appointment = appointments.find((item) => item._id === id);

    if (!appointment) return;

    if (status === "Confirmed" && appointment.paymentStatus !== "Paid") {
      setError("Payment must be verified before confirming this appointment.");
      return;
    }

    if (
      status === "Cancelled" &&
      !window.confirm("Are you sure you want to cancel this appointment?")
    ) {
      return;
    }

    setProcessing(id);
    setError("");
    setSuccess("");

    try {
      await axios.put(
        `${API_URL}/appointments/${id}`,
        { status },
        getAuthConfig()
      );

      setAppointments((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );

      setSelectedAppointment((current) =>
        current?._id === id ? { ...current, status } : current
      );

      setSuccess(`Appointment ${status.toLowerCase()} successfully.`);
    } catch (err) {
      console.error(
        "Unable to update appointment:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          `Unable to change appointment status to ${status}.`
      );
    } finally {
      setProcessing(null);
    }
  };

  const deleteAppointment = async (id) => {
    if (
      !window.confirm(
        "Delete this appointment permanently? This cannot be undone."
      )
    ) {
      return;
    }

    setProcessing(id);
    setError("");
    setSuccess("");

    try {
      await axios.delete(
        `${API_URL}/appointments/${id}`,
        getAuthConfig()
      );

      setAppointments((current) =>
        current.filter((item) => item._id !== id)
      );

      setSelectedAppointment(null);
      setSuccess("Appointment deleted successfully.");
    } catch (err) {
      console.error(
        "Unable to delete appointment:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete appointment. Please try again."
      );
    } finally {
      setProcessing(null);
    }
  };

  const saveAppointment = async (event) => {
    event.preventDefault();

    if (!editingAppointment?._id) return;

    setProcessing(editingAppointment._id);
    setError("");
    setSuccess("");

    try {
      const payload = {
        date: editingAppointment.date,
        time: editingAppointment.time,
        consultationType: editingAppointment.consultationType,
      };

      const response = await axios.put(
        `${API_URL}/appointments/${editingAppointment._id}`,
        payload,
        getAuthConfig()
      );

      const returned = response.data?.data || response.data?.appointment;

      setAppointments((current) =>
        current.map((item) =>
          item._id === editingAppointment._id
            ? { ...item, ...payload, ...(returned || {}) }
            : item
        )
      );

      setSelectedAppointment((current) =>
        current?._id === editingAppointment._id
          ? { ...current, ...payload, ...(returned || {}) }
          : current
      );

      setEditingAppointment(null);
      setSuccess("Appointment details updated successfully.");
    } catch (err) {
      console.error(
        "Unable to edit appointment:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to edit appointment. Check whether your backend supports editing these fields."
      );
    } finally {
      setProcessing(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch = [
        appointment.fullName,
        appointment.phone,
        appointment.email,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "Pending").length,
      confirmed: appointments.filter((a) => a.status === "Confirmed").length,
      cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    }),
    [appointments]
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow">
        <RefreshCw
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />
        <p className="mt-3 text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total appointments", stats.total],
          ["Pending", stats.pending],
          ["Confirmed", stats.confirmed],
          ["Cancelled", stats.cancelled],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Appointments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage patient appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchAppointments(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 items-center rounded-xl border px-4">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient, phone or email..."
                className="w-full bg-transparent px-3 py-3 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {success}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Date &amp; time</th>
                <th className="p-4">Consultation</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">
                      {appointment.fullName || "Unnamed patient"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.phone || "No phone provided"}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays size={15} />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={15} />
                      {appointment.time || "Time not set"}
                    </div>
                  </td>

                  <td className="p-4 text-sm">
                    {appointment.consultationType || "Not specified"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentColor(appointment.paymentStatus)}`}
                    >
                      {appointment.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        title="View details"
                        className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          processing === appointment._id ||
                          appointment.paymentStatus !== "Paid" ||
                          appointment.status === "Confirmed"
                        }
                        onClick={() =>
                          updateStatus(appointment._id, "Confirmed")
                        }
                        title={
                          appointment.paymentStatus !== "Paid"
                            ? "Payment must be verified first"
                            : "Confirm appointment"
                        }
                        className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          processing === appointment._id ||
                          appointment.status === "Completed"
                        }
                        onClick={() =>
                          updateStatus(appointment._id, "Completed")
                        }
                        title="Mark completed"
                        className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <CheckCircle size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          processing === appointment._id ||
                          appointment.status === "Cancelled"
                        }
                        onClick={() =>
                          updateStatus(appointment._id, "Cancelled")
                        }
                        title="Cancel appointment"
                        className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <X size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={processing === appointment._id}
                        onClick={() =>
                          setEditingAppointment({
                            _id: appointment._id,
                            date: appointment.date
                              ? String(appointment.date).slice(0, 10)
                              : "",
                            time: appointment.time || "",
                            consultationType: appointment.consultationType || "",
                          })
                        }
                        title="Edit appointment"
                        className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={processing === appointment._id}
                        onClick={() => deleteAppointment(appointment._id)}
                        title="Delete appointment"
                        className="rounded-lg bg-gray-800 p-2 text-white hover:bg-black disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    {appointments.length === 0
                      ? "No appointments have been recorded yet."
                      : "No appointments match your search or filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAppointment(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Appointment details
                </h3>
                <p className="text-sm text-gray-500">
                  Patient and booking information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close appointment details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Info label="Patient" value={selectedAppointment.fullName} icon={<User size={16} />} />
                <Info label="Phone" value={selectedAppointment.phone} icon={<Phone size={16} />} />
                <Info label="Email" value={selectedAppointment.email} />
                <Info
                  label="Age / Gender"
                  value={`${selectedAppointment.age ?? "—"} / ${selectedAppointment.gender || "—"}`}
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <h4 className="mb-3 font-semibold">Appointment</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Date" value={formatDate(selectedAppointment.date)} />
                  <Info label="Time" value={selectedAppointment.time} />
                  <Info label="Consultation" value={selectedAppointment.consultationType} />
                  <Info label="Status" value={selectedAppointment.status} />
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Symptoms / problem</h4>
                <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedAppointment.symptoms || "No symptoms provided."}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold">
                  <CreditCard size={18} />
                  Payment information
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Info
                    label="Amount"
                    value={`₹${selectedAppointment.paymentAmount ?? 300}`}
                  />
                  <Info label="Method" value={selectedAppointment.paymentMethod || "UPI"} />
                  <Info label="Payment status" value={selectedAppointment.paymentStatus} />
                  <Info label="Transaction ID" value={selectedAppointment.transactionId} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    processing === selectedAppointment._id ||
                    selectedAppointment.paymentStatus !== "Paid"
                  }
                  onClick={() =>
                    updateStatus(selectedAppointment._id, "Confirmed")
                  }
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Confirm
                </button>

                <button
                  type="button"
                  disabled={processing === selectedAppointment._id}
                  onClick={() =>
                    updateStatus(selectedAppointment._id, "Completed")
                  }
                  className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-300"
                >
                  Complete
                </button>

                <button
                  type="button"
                  disabled={processing === selectedAppointment._id}
                  onClick={() =>
                    updateStatus(selectedAppointment._id, "Cancelled")
                  }
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={saveAppointment}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900">
              Edit appointment
            </h3>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <input
                type="date"
                required
                value={editingAppointment.date}
                onChange={(event) =>
                  setEditingAppointment((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="w-full rounded-xl border px-4 py-3"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">Time</span>
              <input
                type="text"
                required
                value={editingAppointment.time}
                onChange={(event) =>
                  setEditingAppointment((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
                placeholder="e.g. 10:30 AM"
                className="w-full rounded-xl border px-4 py-3"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-gray-700">
                Consultation type
              </span>
              <input
                type="text"
                required
                value={editingAppointment.consultationType}
                onChange={(event) =>
                  setEditingAppointment((current) => ({
                    ...current,
                    consultationType: event.target.value,
                  }))
                }
                className="w-full rounded-xl border px-4 py-3"
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingAppointment(null)}
                className="flex-1 rounded-xl border px-4 py-3 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing === editingAppointment._id}
                className="flex-1 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {processing === editingAppointment._id
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 break-words font-medium text-gray-900">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : value}
      </p>
    </div>
  );
}
