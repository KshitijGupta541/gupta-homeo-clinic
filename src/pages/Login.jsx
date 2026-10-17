
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("guptahomeoclinic@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      const data = response.data;

      if (!data.token) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      localStorage.setItem("token", data.token);

      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 sm:p-10 shadow-lg">
        <div className="mb-8 flex items-center justify-center gap-3">
          <LockKeyhole
            size={30}
            className="text-blue-600"
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full rounded-md border border-gray-200 bg-blue-50 px-4 py-4 text-lg text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full rounded-md border border-gray-200 bg-blue-50 px-4 py-4 text-lg text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
            />
          </div>

          {error && (
            <div
              role="alert"
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
                />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
