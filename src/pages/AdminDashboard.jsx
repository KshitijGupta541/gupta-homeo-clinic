import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import StatsCards from "../components/dashboard/StatsCards";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import {
  CalendarDays,
  PlusCircle,
  UserPlus,
  ClipboardList,
} from "lucide-react";

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <Header />

        <main className="p-8">

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl text-white p-8 shadow-xl mb-8">

            <h1 className="text-4xl font-bold">
              Welcome, Dr. Dinesh Gupta 👋
            </h1>

            <p className="mt-3 text-emerald-100 text-lg">
              Gupta Homeo Clinic Management Dashboard
            </p>

            <div className="flex items-center gap-2 mt-5 text-emerald-50">
              <CalendarDays size={20} />
              {today}
            </div>

          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">

            <button className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition">

              <div className="bg-emerald-100 p-4 rounded-xl">
                <PlusCircle className="text-emerald-600" />
              </div>

              <div className="text-left">
                <h3 className="font-bold">
                  New Appointment
                </h3>

                <p className="text-gray-500 text-sm">
                  Book patient appointment
                </p>
              </div>

            </button>

            <button className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition">

              <div className="bg-blue-100 p-4 rounded-xl">
                <UserPlus className="text-blue-600" />
              </div>

              <div className="text-left">
                <h3 className="font-bold">
                  Add Patient
                </h3>

                <p className="text-gray-500 text-sm">
                  Register new patient
                </p>
              </div>

            </button>

            <button className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl transition">

              <div className="bg-purple-100 p-4 rounded-xl">
                <ClipboardList className="text-purple-600" />
              </div>

              <div className="text-left">
                <h3 className="font-bold">
                  Reports
                </h3>

                <p className="text-gray-500 text-sm">
                  View clinic reports
                </p>
              </div>

            </button>

          </div>

          {/* Stats */}
          <StatsCards />

          {/* Recent Appointments */}
          <div className="mt-10 bg-white rounded-3xl shadow-xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Recent Appointments
                </h2>

                <p className="text-gray-500">
                  Latest appointments
                </p>

              </div>

            </div>

            <RecentAppointments />

          </div>

        </main>

      </div>

    </div>
  );
}