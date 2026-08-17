import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Treatments from "./pages/Treatments";
import PatientStories from "./pages/PatientStories";
import Appointment from "./pages/Appointment";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC WEBSITE
        ========================= */}

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="patient-stories" element={<PatientStories />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
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
    </BrowserRouter>
  );
}

export default App;