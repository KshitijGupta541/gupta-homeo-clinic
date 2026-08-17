import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  Stethoscope,
} from "lucide-react";

const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];

export default function AppointmentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    consultationType: "Clinic Visit",
    date: "",
    time: "",
    symptoms: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await axios.post(
        "https://gupta-homeo-clinic.onrender.com/api/appointments",
        formData
      );

      /*
        Different versions of the backend may return the
        newly created appointment in slightly different places.
      */

      const appointment =
        response.data?.data ||
        response.data?.appointment ||
        response.data?.data?.appointment;

      const appointmentId =
        appointment?._id ||
        response.data?.appointmentId ||
        response.data?.data?._id;

      if (!appointmentId) {
        console.error(
          "Appointment created but appointment ID was not returned:",
          response.data
        );

        alert(
          "Appointment was created, but we couldn't open the payment page. Please contact the clinic."
        );

        return;
      }

      /*
        Appointment successfully created.
        Now send the patient directly to the ₹300 payment page.
      */

      navigate(`/payment/${appointmentId}`);
    } catch (error) {
      console.error("Appointment booking error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">

          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">
              Appointment Details
            </h2>

            <p className="text-gray-500 mt-3">
              Fill in the details below to request an appointment.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6"
          >

            {/* Full Name */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <User size={18} />
                Full Name
              </label>

              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <Phone size={18} />
                Phone Number
              </label>

              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="9876543210"
              />
            </div>

            {/* Email */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="example@email.com"
              />
            </div>

            {/* Age */}

            <div>
              <label className="font-medium mb-2">
                Age
              </label>

              <input
                type="number"
                required
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* Gender */}

            <div>
              <label className="font-medium mb-2">
                Gender
              </label>

              <select
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Select Gender
                </option>

                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Consultation */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <Stethoscope size={18} />
                Consultation
              </label>

              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option>
                  Clinic Visit
                </option>

                <option>
                  Online Consultation
                </option>
              </select>
            </div>

            {/* Date */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Preferred Date
              </label>

              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* Time */}

            <div>
              <label className="font-medium mb-2 flex items-center gap-2">
                <Clock size={18} />
                Preferred Time
              </label>

              <select
                required
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Select Time
                </option>

                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Symptoms */}

            <div className="md:col-span-2">
              <label className="font-medium mb-2 flex items-center gap-2">
                <FileText size={18} />
                Describe Your Problem
              </label>

              <textarea
                rows="5"
                required
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="Please describe your symptoms..."
              />
            </div>

            {/* Payment */}

            <div className="md:col-span-2 bg-emerald-50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-5">

              <div>
                <p className="text-gray-600">
                  Consultation Fee
                </p>

                <h3 className="text-3xl font-bold text-emerald-700">
                  ₹300
                </h3>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 transition text-white px-10 py-4 rounded-xl font-semibold"
              >
                {submitting
                  ? "Booking..."
                  : "Book Appointment"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}