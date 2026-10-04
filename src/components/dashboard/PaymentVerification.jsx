import { useEffect, useState } from "react";
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
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentVerification() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/appointments`
      );

      const data = response.data?.data || [];

      const pendingPayments = data.filter(
        (appointment) =>
          appointment.paymentStatus === "Pending Verification"
      );

      setAppointments(pendingPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ======================================================
  // APPROVE PAYMENT
  // ======================================================

  const approvePayment = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this payment?"
    );

    if (!confirmed) return;

    try {
      setProcessing(appointmentId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin session expired. Please login again.");
        return;
      }

      await axios.put(
        `${API_URL}/payments/${appointmentId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Payment approved successfully. Appointment confirmed."
      );

      setSelectedPayment(null);

      await fetchPayments();
    } catch (error) {
      console.error("Approve payment error:", error);

      if (error.response?.status === 401) {
        alert("Your admin session has expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to approve payment."
        );
      }
    } finally {
      setProcessing(null);
    }
  };

  // ======================================================
  // REJECT PAYMENT
  // ======================================================

  const rejectPayment = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this payment?"
    );

    if (!confirmed) return;

    try {
      setProcessing(appointmentId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin session expired. Please login again.");
        return;
      }

      await axios.put(
        `${API_URL}/payments/${appointmentId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment rejected.");

      setSelectedPayment(null);

      await fetchPayments();
    } catch (error) {
      console.error("Reject payment error:", error);

      if (error.response?.status === 401) {
        alert("Your admin session has expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to reject payment."
        );
      }
    } finally {
      setProcessing(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <RefreshCw
          className="animate-spin mx-auto text-emerald-600"
          size={30}
        />

        <p className="text-gray-500 mt-3">
          Loading payment requests...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ==================================================
          PAYMENT TABLE
      ================================================== */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}

        <div className="p-6 border-b flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Verification
            </h2>

            <p className="text-gray-500 mt-1">
              Review and verify patient consultation payments.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            title="Refresh"
          >
            <RefreshCw size={19} />
          </button>

        </div>

        {/* Empty State */}

        {appointments.length === 0 ? (
          <div className="p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle
                size={32}
                className="text-emerald-600"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-5">
              No Pending Payments
            </h3>

            <p className="text-gray-500 mt-2">
              All payment requests have been processed.
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-emerald-600 text-white">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left">
                    Appointment
                  </th>

                  <th className="px-6 py-4 text-left">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left">
                    Transaction ID
                  </th>

                  <th className="px-6 py-4 text-center">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {appointments.map((appointment) => (

                  <tr
                    key={appointment._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-5">

                      <p className="font-semibold text-gray-800">
                        {appointment.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {appointment.phone}
                      </p>

                    </td>

                    <td className="px-6 py-5">

                      <p className="text-sm">
                        {new Date(
                          appointment.date
                        ).toLocaleDateString("en-IN")}
                      </p>

                      <p className="text-sm text-gray-500">
                        {appointment.time}
                      </p>

                    </td>

                    <td className="px-6 py-5">

                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <IndianRupee size={16} />
                        {appointment.paymentAmount || 300}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span className="font-mono text-sm">
                        {appointment.transactionId ||
                          "Not provided"}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-center">

                      <button
                        onClick={() =>
                          setSelectedPayment(appointment)
                        }
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
                      >
                        <Eye size={17} />
                        View
                      </button>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <button
                          disabled={
                            processing === appointment._id
                          }
                          onClick={() =>
                            approvePayment(
                              appointment._id
                            )
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle size={17} />
                          Approve
                        </button>

                        <button
                          disabled={
                            processing === appointment._id
                          }
                          onClick={() =>
                            rejectPayment(
                              appointment._id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <XCircle size={17} />
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

      {/* ==================================================
          PAYMENT DETAILS MODAL
      ================================================== */}

      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Payment Details
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Verify payment before approving.
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              <div className="grid sm:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={16} />
                    Patient
                  </div>

                  <p className="font-semibold mt-1">
                    {selectedPayment.fullName}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="text-gray-500 text-sm">
                    Phone
                  </div>

                  <p className="font-semibold mt-1">
                    {selectedPayment.phone}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    Date
                  </div>

                  <p className="font-semibold mt-1">
                    {new Date(
                      selectedPayment.date
                    ).toLocaleDateString("en-IN")}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={16} />
                    Time
                  </div>

                  <p className="font-semibold mt-1">
                    {selectedPayment.time}
                  </p>

                </div>

              </div>

              {/* Amount */}

              <div className="bg-emerald-50 rounded-2xl p-5 mt-6">

                <p className="text-gray-600 text-sm">
                  Consultation Fee
                </p>

                <p className="text-3xl font-bold text-emerald-700">
                  ₹{selectedPayment.paymentAmount || 300}
                </p>

              </div>

              {/* Transaction ID */}

              <div className="mt-6">

                <p className="font-semibold text-gray-700">
                  Transaction ID
                </p>

                <div className="bg-gray-100 rounded-xl p-4 mt-2 font-mono break-all">
                  {selectedPayment.transactionId ||
                    "Not provided"}
                </div>

              </div>

              {/* Screenshot */}

              {selectedPayment.paymentScreenshot ? (
                <div className="mt-6">

                  <p className="font-semibold text-gray-700 mb-3">
                    Payment Screenshot
                  </p>

                  <div className="border rounded-2xl overflow-hidden bg-gray-50">
                    <img
                      src={
                        selectedPayment.paymentScreenshot
                      }
                      alt="Payment proof"
                      className="w-full max-h-[500px] object-contain"
                    />
                  </div>

                </div>
              ) : (
                <div className="mt-6 bg-yellow-50 text-yellow-700 rounded-xl p-4">
                  Payment screenshot has not been uploaded.
                </div>
              )}

              {/* Actions */}

              <div className="flex gap-3 mt-8">

                <button
                  disabled={
                    processing === selectedPayment._id
                  }
                  onClick={() =>
                    approvePayment(
                      selectedPayment._id
                    )
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Approve Payment
                </button>

                <button
                  disabled={
                    processing === selectedPayment._id
                  }
                  onClick={() =>
                    rejectPayment(
                      selectedPayment._id
                    )
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject Payment
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}