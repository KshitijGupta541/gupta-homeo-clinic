
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://gupta-homeo-clinic.onrender.com/api"
).replace(/\/+$/, "");

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("guptahomeoclinic@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          timeout: 20000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data?.token) {
        setError(
          data?.message ||
            "Login failed. The server did not return an authentication token."
        );
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.admin) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
      }

      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError(
          "The server took too long to respond. Please try again."
        );
      } else if (err.response) {
        setError(
          err.response.data?.message ||
            `Login failed (HTTP ${err.response.status}).`
        );
      } else if (err.request) {
        setError(
          "Unable to reach the server. Please check your connection and try again."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <LockKeyhole
            size={30}
            className="shrink-0 text-blue-600"
            aria-hidden="true"
          />

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full rounded-md border border-gray-200 bg-blue-50 px-4 py-4 text-lg text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full rounded-md border border-gray-200 bg-blue-50 px-4 py-4 text-lg text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={22}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
