import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  Settings,
  LogOut,
  HeartPulse,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      title: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <CalendarDays size={20} />,
      title: "Appointments",
      path: "/admin/appointments",
    },
    {
      icon: <Users size={20} />,
      title: "Patients",
      path: "/admin/patients",
    },
    {
      icon: <CreditCard size={20} />,
      title: "Payments",
      path: "/admin/payments",
    },
    {
      icon: <Settings size={20} />,
      title: "Settings",
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="w-72 bg-emerald-700 text-white min-h-screen flex flex-col shadow-xl">

      {/* Logo */}

      <div className="p-8 border-b border-emerald-600">

        <div className="flex items-center gap-3">

          <HeartPulse size={36} />

          <div>

            <h2 className="text-2xl font-bold">
              Gupta Homeo
            </h2>

            <p className="text-sm text-emerald-100">
              Clinic Admin
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-5">

        <ul className="space-y-3">

          {menuItems.map((item) => (

            <li key={item.title}>

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-emerald-700 shadow-lg"
                      : "hover:bg-emerald-600"
                  }`
                }
              >

                {item.icon}

                <span className="font-medium">
                  {item.title}
                </span>

              </NavLink>

            </li>

          ))}

        </ul>

      </nav>

      {/* Doctor Card */}

      <div className="p-5 border-t border-emerald-600">

        <div className="bg-emerald-600 rounded-2xl p-5">

          <p className="text-sm text-emerald-100">
            Logged in as
          </p>

          <h3 className="font-bold text-lg mt-1">
            Dr. Dinesh Gupta
          </h3>

          <p className="text-sm text-emerald-100 mt-1">
            Homeopathic Skin Specialist
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-white text-emerald-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}