import StatsCards from "../components/dashboard/StatsCards";
import AppointmentTable from "../components/dashboard/AppointmentTable";
import PaymentVerification from "../components/dashboard/PaymentVerification";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Doctor Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to Gupta Homeo Clinic Management System
          </p>
        </div>

        {/* Statistics */}
        <StatsCards />

        {/* Appointments */}
        <div className="mt-8">
          <AppointmentTable />
        </div>

        {/* Payment Verification */}
        <div className="mt-8">
          <PaymentVerification />
        </div>

      </main>

    </div>
  );
}