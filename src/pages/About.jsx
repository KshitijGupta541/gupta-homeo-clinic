import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import doctorImage from "../assets/images/doctor.jpeg";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-emerald-600 to-green-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-widest text-emerald-100">
            About Our Doctor
          </p>

          <h1 className="text-5xl font-bold mt-3">
            Dr. Dinesh Gupta
          </h1>

          <p className="text-xl mt-4 max-w-3xl">
            BHMS • Homeopathic Skin Specialist • 20+ Years of Experience
          </p>

        </div>
      </section>


      {/* Doctor Section */}

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">

        {/* Doctor Image */}

        <div className="flex justify-center">

          <img
            src={doctorImage}
            alt="Dr. Dinesh Gupta"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-white object-cover"
          />

        </div>


        {/* Doctor Details */}

        <div>

          <span className="text-emerald-600 font-semibold">
            BHMS • Homeopathic Skin Specialist
          </span>

          <h2 className="text-4xl font-bold mt-3">
            Healing Naturally, Caring Personally
          </h2>

          <p className="text-gray-600 mt-6 leading-8">
            Dr. Dinesh Gupta is a BHMS-qualified Homeopathic Skin Specialist
            with over 20 years of clinical experience. He believes in treating
            the root cause of illness through personalized homeopathic care,
            helping patients achieve long-term wellness using safe and natural
            medicines.
          </p>


          <div className="grid grid-cols-2 gap-6 mt-10">

            <div className="flex gap-3">

              <Award className="text-emerald-600" />

              <div>
                <h3 className="font-semibold">
                  20+ Years
                </h3>

                <p className="text-sm text-gray-500">
                  Clinical Experience
                </p>
              </div>

            </div>


            <div className="flex gap-3">

              <Stethoscope className="text-emerald-600" />

              <div>
                <h3 className="font-semibold">
                  BHMS
                </h3>

                <p className="text-sm text-gray-500">
                  Qualified Homeopathic Doctor
                </p>
              </div>

            </div>


            <div className="flex gap-3">

              <ShieldCheck className="text-emerald-600" />

              <div>
                <h3 className="font-semibold">
                  Skin Specialist
                </h3>

                <p className="text-sm text-gray-500">
                  Personalized Treatment
                </p>
              </div>

            </div>


            <div className="flex gap-3">

              <HeartHandshake className="text-emerald-600" />

              <div>
                <h3 className="font-semibold">
                  Patient-Centered Care
                </h3>

                <p className="text-sm text-gray-500">
                  Compassion & Trust
                </p>
              </div>

            </div>

          </div>


          <NavLink to="/appointment">

            <button className="mt-10 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl transition">
              Book Appointment
            </button>

          </NavLink>

        </div>

      </section>

    </div>
  );
}