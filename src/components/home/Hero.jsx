import { Calendar, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 py-20">

        {/* Left Section */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            Trusted by 50,000+ Happy Patients
          </span>

          <h1 className="text-6xl font-extrabold leading-tight mt-6 text-gray-900">
            Natural Healing
            <br />
            Better Living.
          </h1>

          <p className="text-gray-600 text-lg mt-6 leading-8">
            Personalized homeopathic treatment for skin diseases,
            allergies, chronic illnesses, and overall wellness.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            {/* Book Appointment */}

            <button
              onClick={() => navigate("/appointment")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all duration-300 text-white px-6 py-4 rounded-xl shadow-lg"
            >
              <Calendar size={20} />
              Book Appointment
            </button>

            {/* Online Consultation */}

            <button
              onClick={() => navigate("/appointment")}
              className="flex items-center gap-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:scale-105 transition-all duration-300 px-6 py-4 rounded-xl"
            >
              <Video size={20} />
              Online Consultation
            </button>

          </div>

        </motion.div>

        {/* Right Section */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >

          <div className="bg-white rounded-3xl shadow-2xl p-8 w-80 h-96 flex items-center justify-center">

            <div className="text-center">

              {/* Doctor Photo */}

              <img
                src="/doctor.jpg"
                alt="Dr. Dinesh Gupta"
                width="144"
                height="144"
                fetchPriority="high"
                decoding="async"
                className="w-36 h-36 rounded-full object-cover mx-auto mb-6 shadow-xl border-4 border-emerald-100"
              />

              <h2 className="text-2xl font-bold text-gray-900">
                Dr. Dinesh Gupta
              </h2>

              <p className="text-gray-500 mt-2">
                Homeopathic Skin Specialist
              </p>

              <p className="text-emerald-600 font-semibold mt-3">
                Caring for Your Health Naturally
              </p>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}