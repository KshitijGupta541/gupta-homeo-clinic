import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { lazy, Suspense } from "react";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// LAZY LOADED PAGES
// ======================================================

// Public pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Treatments = lazy(() => import("./pages/Treatments"));
const PatientStories = lazy(
  () => import("./pages/PatientStories")
);
const Appointment = lazy(
  () => import("./pages/Appointment")
);
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));

// Payment
const Payment = lazy(() => import("./pages/Payment"));

// Authentication
const Login = lazy(() => import("./pages/Login"));

// Admin
const Dashboard = lazy(
  () => import("./pages/Dashboard")
);

const Patients = lazy(
  () => import("./pages/Patients")
);

// 404
const NotFound = lazy(
  () => import("./pages/NotFound")
);


// ======================================================
// LOADING SCREEN
// ======================================================

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center">

        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />

        <p className="mt-4 text-gray-500">
          Loading...
        </p>

      </div>

    </div>
  );
}


// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* =========================
              PUBLIC WEBSITE
          ========================= */}

          <Route
            path="/"
            element={<MainLayout />}
          >

            <Route
              index
              element={<Home />}
            />

            <Route
              path="about"
              element={<About />}
            />

            <Route
              path="treatments"
              element={<Treatments />}
            />

            <Route
              path="patient-stories"
              element={<PatientStories />}
            />

            <Route
              path="appointment"
              element={<Appointment />}
            />

            <Route
              path="faq"
              element={<FAQ />}
            />

            <Route
              path="contact"
              element={<Contact />}
            />

          </Route>


          {/* =========================
              PAYMENT
          ========================= */}

          <Route
            path="/payment/:appointmentId"
            element={<Payment />}
          />


          {/* =========================
              LOGIN
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* =========================
              ADMIN PANEL
          ========================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="patients"
              element={<Patients />}
            />

          </Route>


          {/* =========================
              404
          ========================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}

export default App;