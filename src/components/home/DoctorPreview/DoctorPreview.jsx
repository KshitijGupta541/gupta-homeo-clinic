import { Award, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import doctorImage from "../../../assets/images/doctor.jpeg";

export default function DoctorPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

        {/* Doctor Image */}

        <div className="flex justify-center">

          <img
            src={doctorImage}
            alt="Dr. Dinesh Gupta"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full max-w-md rounded-3xl shadow-2xl object-cover"
          />

        </div>

        {/* Doctor Details */}

        <div>

          <p className="text-emerald-600 uppercase tracking-widest font-semibold">
            Meet Our Doctor
          </p>

          <h2 className="text-5xl font-bold mt-3">
            Dr. Dinesh Gupta
          </h2>

          <p className="text-xl text-gray-500 mt-2">
            BHMS • Homeopathic Skin Specialist
          </p>

          <p className="mt-6 text-gray-600 leading-8">
            With over 20 years of experience, Dr. Dinesh Gupta has helped
            thousands of patients through personalized homeopathic treatment.
            His approach focuses on identifying and treating the root cause of
            illness while providing compassionate and patient-centered care.
          </p>

          <div className="flex items-center gap-3 mt-8">

            <Award
              className="text-emerald-600"
              size={28}
            />

            <div>

              <h3 className="font-bold text-lg">
                20+ Years of Experience
              </h3>

              <p className="text-gray-500">
                Trusted Homeopathic Care
              </p>

            </div>

          </div>

          <div className="flex gap-4 mt-10">

            <NavLink to="/about">

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl transition">
                Read Full Profile
              </button>

            </NavLink>

            <NavLink to="/appointment">

              <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-7 py-3 rounded-xl transition flex items-center gap-2">
                Book Appointment
                <ArrowRight size={18} />
              </button>

            </NavLink>

          </div>

        </div>

      </div>
    </section>
  );
}