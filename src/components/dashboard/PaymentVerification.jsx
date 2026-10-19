
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  IndianRupee,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://gupta-homeo-clinic.onrender.com/api"
).replace(/\/+$/, "");

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? String(date)
    : parsed.toLocaleDateString("en-IN");
}

export default function PaymentVerification() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
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

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/appointments`,
        getAuthConfig()
      );

      const body = response.data;

      const allAppointments = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
          ? body.data
          : Array.isArray(body?.appointments)
            ? body.appointments
            : [];

      // Include requests with or without transaction details.
      // Also include manually unpaid appointments for admin review.
      const pendingPayments = allAppointments.filter((appointment) => {
        const paymentStatus = String(
          appointment.paymentStatus || "Pending"
        ).toLowerCase();

        return [
          "pending",
          "pending verification",
          "unpaid",
          "rejected",
        ].includes(paymentStatus);
      });

      setAppointments(pendingPayments);

      setSelectedPayment((current) => {
        if (!current) return null;

        return (
          pendingPayments.find((item) => item._id === current._id) || null
        );
      });
    } catch (err) {
      console.error(
        "Failed to load payment requests:",
        err.response?.data || err.message
      );

      setError(
        err.response?.status === 401
          ? "Your admin session may have expired. Please log in again."
          : err.response?.data?.message ||
              "Unable to load payment requests."
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthConfig]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const verifyPayment = async (appointment, action) => {
    const isApproval = action === "approve";

    const message = isApproval
      ? `Confirm that ₹${appointment.paymentAmount ?? 300} was actually received for ${appointment.fullName || "this patient"}? Only approve after checking your bank or UPI account. A transaction ID is not required for manual verification.`
      : `Reject the payment for ${appointment.fullName || "this patient"}?`;

    if (!window.confirm(message)) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your admin session has expired. Please log in again.");
      return;
    }

    setProcessing(appointment._id);
    setError("");
    setSuccess("");

    try {
      const endpoint = isApproval ? "approve" : "reject";

      await axios.put(
        `${API_URL}/payments/${appointment._id}/${endpoint}`,
        {},
        getAuthConfig()
      );

      setSelectedPayment(null);

      setSuccess(
        isApproval
          ? "Payment verification submitted successfully."
          : "Payment rejection submitted successfully."
      );

      await fetchPayments();
    } catch (err) {
      console.error(
        "Payment verification failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          `Unable to ${isApproval ? "approve" : "reject"} this payment.`
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <RefreshCw
          size={30}
          className="mx-auto animate-spin text-emerald-600"
        />
        <p className="mt-3 text-gray-500">
          Loading payment requests...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Verification
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Verify payments manually, including payments without transaction IDs.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle
              size={36}
              className="mx-auto text-emerald-600"
            />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No pending payments
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              No payments currently require verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-left">
              <thead className="bg-emerald-700 text-sm text-white">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Appointment</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment) => (
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
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar size={15} />
                        {formatDate(appointment.date)}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={15} />
                        {appointment.time || "Not specified"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center font-bold text-emerald-700">
                        <IndianRupee size={16} />
                        {appointment.paymentAmount ?? 300}
                      </span>
                    </td>

                    <td className="max-w-40 break-all p-4 font-mono text-sm">
                      {appointment.transactionId || "Not provided"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        {appointment.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment(appointment)}
                          title="View payment details"
                          className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={processing === appointment._id}
                          onClick={() => verifyPayment(appointment, "approve")}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle size={16} />
                          {processing === appointment._id
                            ? "Saving..."
                            : "Mark as Paid"}
                        </button>

                        <button
                          type="button"
                          disabled={processing === appointment._id}
                          onClick={() => verifyPayment(appointment, "reject")}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Payment details
                </h3>
                <p className="text-sm text-gray-500">
                  Check the payment before approving it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                aria-label="Close payment details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <Info
                icon={<User size={16} />}
                label="Patient"
                value={selectedPayment.fullName}
              />
              <Info
                label="Phone"
                value={selectedPayment.phone}
              />
              <Info
                icon={<Calendar size={16} />}
                label="Appointment date"
                value={formatDate(selectedPayment.date)}
              />
              <Info
                icon={<Clock size={16} />}
                label="Appointment time"
                value={selectedPayment.time}
              />

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard size={16} />
                  Payment amount
                </p>
                <p className="mt-1 text-3xl font-bold text-emerald-700">
                  ₹{selectedPayment.paymentAmount ?? 300}
                </p>
              </div>

              <Info
                label="Transaction ID"
                value={selectedPayment.transactionId || "Not provided"}
              />

              {selectedPayment.paymentScreenshot ? (
                <div>
                  <p className="mb-2 font-semibold">Payment screenshot</p>
                  <img
                    src={selectedPayment.paymentScreenshot}
                    alt="Customer payment proof"
                    className="max-h-[400px] w-full rounded-xl border object-contain"
                  />
                </div>
              ) : (
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  No payment screenshot was uploaded. Check your bank or UPI
                  account before manually marking this payment as received.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={processing === selectedPayment._id}
                  onClick={() => verifyPayment(selectedPayment, "approve")}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Mark as Paid
                </button>

                <button
                  type="button"
                  disabled={processing === selectedPayment._id}
                  onClick={() => verifyPayment(selectedPayment, "reject")}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words font-medium text-gray-900">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : value}
      </p>
    </div>
  );
}
