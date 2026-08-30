import { FaInstagram } from "react-icons/fa";
import { PlayCircle } from "lucide-react";
import patientStories from "../data/patientStories";

export default function PatientStories() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}

      <section className="bg-emerald-600 text-white py-20 text-center">

        <h1 className="text-5xl font-bold">
          Patient Success Stories
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-lg">
          Watch real patient experiences and recovery journeys shared by
          Gupta Homeo Clinic.
        </p>

      </section>


      {/* Stories */}

      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {patientStories.map((story) => (

            <div
              key={story.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >

              {/* Clickable Thumbnail */}

              <a
                href={story.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >

                <div className="relative h-64 overflow-hidden group">

                  <img
                    src={story.image}
                    alt={story.title}
                    width="800"
                    height="512"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>

                  {/* Play Button */}

                  <div className="absolute inset-0 flex items-center justify-center">

                    <PlayCircle
                      size={80}
                      className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                    />

                  </div>

                  {/* Watch Story Badge */}

                  <div className="absolute bottom-4 left-4 bg-white text-emerald-700 px-4 py-2 rounded-full font-semibold shadow-lg">
                    ▶ Watch Story
                  </div>

                </div>

              </a>


              {/* Content */}

              <div className="p-6">

                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {story.category}
                </span>

                <h3 className="text-2xl font-bold mt-4">
                  {story.title}
                </h3>

                <p className="text-gray-600 mt-4">
                  {story.description}
                </p>

                <a
                  href={story.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white px-5 py-3 rounded-xl transition"
                >
                  <FaInstagram />
                  Watch Full Story
                </a>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Instagram CTA */}

      <section className="bg-white py-20">

        <div className="max-w-4xl mx-auto text-center px-6">

          <FaInstagram
            size={60}
            className="mx-auto text-pink-600 mb-6"
          />

          <h2 className="text-4xl font-bold">
            Want to See More Recovery Stories?
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Follow us on Instagram to explore more real patient success stories,
            clinic updates, and homeopathic health tips.
          </p>

          <a
            href="https://www.instagram.com/dr.dinesh_gupta27/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-10 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            <FaInstagram size={24} />
            Follow @dr.dinesh_gupta27
          </a>

        </div>

      </section>

    </div>
  );
}