import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  IndianRupee,
  Users,
  CalendarDays,
  CreditCard,
  Hourglass,
  RefreshCw,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    pendingPayments: 0,
    paidPayments: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [appointmentsResponse, patientsResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/appointments`,
            authConfig()
          ),
          axios.get(
            `${API_URL}/patients`,
            authConfig()
          ),
        ]);

      const appointments =
        appointmentsResponse.data?.data || [];

      const patients =
        patientsResponse.data?.patients || [];

      const today = new Date().toLocaleDateString(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
        }
      );

      const todayAppointments =
        appointments.filter((appointment) => {
          if (!appointment.date) return false;

          return (
            new Date(
              appointment.date
            ).toLocaleDateString("en-CA", {
              timeZone: "Asia/Kolkata",
            }) === today
          );
        }).length;

      const pendingAppointments =
        appointments.filter(
          (appointment) =>
            appointment.status === "Pending"
        ).length;

      const confirmedAppointments =
        appointments.filter(
          (appointment) =>
            appointment.status === "Confirmed"
        ).length;

      const completedAppointments =
        appointments.filter(
          (appointment) =>
            appointment.status === "Completed"
        ).length;

      const pendingPayments =
        appointments.filter(
          (appointment) =>
            appointment.paymentStatus === "Pending" ||
            appointment.paymentStatus ===
              "Pending Verification"
        ).length;

      const paidPayments =
        appointments.filter(
          (appointment) =>
            appointment.paymentStatus === "Paid"
        ).length;

      const revenue = appointments
        .filter(
          (appointment) =>
            appointment.paymentStatus === "Paid"
        )
        .reduce(
          (total, appointment) =>
            total +
            Number(
              appointment.paymentAmount || 300
            ),
          0
        );

      setStats({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        todayAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        pendingPayments,
        paidPayments,
        revenue,
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard statistics:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Your admin session has expired. Please login again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      sub: "Registered patients",
      icon: Users,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      sub: "All appointments",
      icon: CalendarDays,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      sub: "Today's schedule",
      icon: CalendarCheck,
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      sub: "Needs attention",
      icon: Clock3,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmedAppointments,
      sub: "Confirmed appointments",
      icon: CheckCircle2,
      color: "from-teal-500 to-emerald-600",
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      sub: "Successfully treated",
      icon: CheckCircle2,
      color: "from-green-500 to-lime-600",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      sub: "Requires verification",
      icon: Hourglass,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Paid Payments",
      value: stats.paidPayments,
      sub: "Verified payments",
      icon: CreditCard,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      sub: "From paid appointments",
      icon: IndianRupee,
      color: "from-fuchsia-500 to-purple-600",
    },
  ];

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Clinic Overview
          </h2>

          <p className="text-sm text-gray-500">
            Live statistics from your clinic
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          title="Refresh statistics"
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* Cards */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-gray-800">
                    {loading ? "—" : card.value}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {card.sub}
                  </p>

                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-br ${card.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}