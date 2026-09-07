import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  BarChart3,
  LockKeyhole,
} from "lucide-react";
import { staffLogin } from "../api/authApis";
import { saveSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await staffLogin({
        username: username.trim(),
        password,
      });

      console.log("Staff login response:", response);

      if (!response?.success || !response?.data?.accessToken) {
        throw new Error(
          response?.message || "Login failed. Please try again."
        );
      }

      const { accessToken, staff } = response.data;

      saveSession({
        accessToken,
        staff,
      });

      console.log("Staff session saved successfully");

      navigate("/orders", { replace: true });
    } catch (error) {
      console.error("Staff login error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login. Please try again.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-[1050px] min-h-[620px] bg-white rounded-[28px] overflow-hidden shadow-[0_20px_70px_rgba(25,60,35,0.10)] border border-gray-100 grid lg:grid-cols-2">

        {/* ================= LEFT BRAND PANEL ================= */}
        <div className="hidden lg:flex relative bg-[#145c35] p-12 flex-col justify-between overflow-hidden">

          {/* Background decoration */}
          <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-green-400/10" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-black/10" />
          <div className="absolute top-1/2 right-[-80px] w-52 h-52 rounded-full border-[35px] border-white/5" />

          {/* Brand */}
          <div className="relative z-10">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-[#145c35]" />
              </div>

              <div>
                <h2 className="text-white text-lg font-extrabold">
                  CD Shopping Hub
                </h2>

                <p className="text-green-100/70 text-[10px] font-medium">
                  ADMIN PANEL
                </p>
              </div>
            </div>

          </div>

          {/* Center Content */}
          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-green-50 text-xs font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Admin Access
            </div>

            <h1 className="text-white text-4xl xl:text-5xl font-extrabold leading-tight">
              Manage your store.
              <br />
              <span className="text-green-200">
                Grow your business.
              </span>
            </h1>

            <p className="text-green-50/70 text-sm leading-6 mt-5 max-w-[400px]">
              Manage products, orders, customers and your entire
              shopping operation from one powerful dashboard.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">

              <Feature
                icon={<ShoppingBag className="w-4 h-4" />}
                title="Manage Orders"
                text="Track and manage customer orders"
              />

              <Feature
                icon={<BarChart3 className="w-4 h-4" />}
                title="Store Analytics"
                text="Monitor your store performance"
              />

              <Feature
                icon={<LockKeyhole className="w-4 h-4" />}
                title="Secure Dashboard"
                text="Protected access for store staff"
              />

            </div>

          </div>

          {/* Footer */}
          <p className="relative z-10 text-[11px] text-green-100/50">
            © 2026 CD Shopping Hub. All rights reserved.
          </p>

        </div>

        {/* ================= RIGHT LOGIN ================= */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

          <div className="w-full max-w-[390px]">

            {/* Mobile Brand */}
            <div className="lg:hidden flex items-center gap-3 mb-10">

              <div className="w-11 h-11 rounded-xl bg-[#145c35] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  CD Shopping Hub
                </h2>

                <p className="text-[10px] text-gray-400 font-semibold">
                  ADMIN PANEL
                </p>
              </div>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <LockKeyhole className="w-5 h-5 text-[#145c35]" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Welcome back
              </h1>

              <p className="text-sm text-gray-400 mt-2">
                Sign in to access your admin dashboard.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              spellCheck={false}
            >

              {/* Fake autofill fields */}
              <input
                type="text"
                name="fake_username"
                autoComplete="username"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
              />

              <input
                type="password"
                name="fake_password"
                autoComplete="current-password"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
              />

              {/* Username */}
              <div className="mb-5">

                <label
                  htmlFor="staff-login-username"
                  className="block text-xs font-bold text-gray-700 mb-2"
                >
                  Username
                </label>

                <input
                  id="staff-login-username"
                  type="text"
                  name="staff_login_username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  disabled={loading}
                  placeholder="Enter your username"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-[#145c35] focus:ring-4 focus:ring-green-50 disabled:opacity-60 disabled:cursor-not-allowed"
                />

              </div>

              {/* Password */}
              <div className="mb-6">

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="staff-login-password"
                    className="text-xs font-bold text-gray-700"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <input
                    id="staff-login-password"
                    type={showPassword ? "text" : "password"}
                    name="staff_login_password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={loading}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-[#145c35] focus:ring-4 focus:ring-green-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#145c35] hover:bg-green-50 transition disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 rounded-xl bg-[#145c35] hover:bg-[#0f4929] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(20,92,53,0.18)] hover:shadow-[0_10px_25px_rgba(20,92,53,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

            </form>

            {/* Bottom */}
            <div className="flex items-center justify-center gap-2 mt-8">

              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />

              <p className="text-[11px] text-gray-400">
                Your account is protected with secure authentication
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* Feature Item */
function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-green-100">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-white">
          {title}
        </p>

        <p className="text-[10px] text-green-100/50 mt-0.5">
          {text}
        </p>
      </div>

    </div>
  );
}