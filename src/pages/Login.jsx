import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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

    // Validation
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

      // Check API response
      if (!response?.success || !response?.data?.accessToken) {
        throw new Error(
          response?.message || "Login failed. Please try again."
        );
      }

      // Get token and staff details
      const { accessToken, staff } = response.data;

      // Save complete staff session
      saveSession({
        accessToken,
        staff,
      });

      console.log("Staff session saved successfully");

      // Redirect after successful login
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
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#f7f8f4]">
      <div className="bg-white border border-[#dde3dc] rounded-[14px] p-8 max-w-[360px] w-full shadow-[0_2px_10px_rgba(28,38,32,0.06)]">

        {/* Brand */}
        <p className="font-['Baloo_2'] font-bold text-xl text-[#1b7340] mb-1">
          CD Shopping Hub
        </p>

        {/* Heading */}
        <h1 className="font-['Baloo_2'] text-[22px] font-bold mb-1 text-[#1b1f1c]">
          Staff Login
        </h1>

        <p className="text-[#5b6960] text-sm mb-6">
          Sign in to manage orders
        </p>

        {/* Error */}
        {error && (
          <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          spellCheck={false}
        >
          {/* 
            Fake fields to discourage browser/password-manager autofill.
            They are intentionally hidden from the user.
          */}
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
          <label
            htmlFor="staff-login-username"
            className="block text-[13px] font-semibold text-[#5b6960] mb-1.5"
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
            placeholder="Enter username"
            className="w-full px-3.5 py-3 border border-[#dde3dc] rounded-[9px] text-base mb-[18px] outline-none focus:ring-2 focus:ring-[#1b7340] focus:border-[#1b7340] disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

          {/* Password */}
          <label
            htmlFor="staff-login-password"
            className="block text-[13px] font-semibold text-[#5b6960] mb-1.5"
          >
            Password
          </label>

          <div className="relative mb-[18px]">
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
              placeholder="Enter password"
              className="w-full px-3.5 py-3 pr-11 border border-[#dde3dc] rounded-[9px] text-base outline-none focus:ring-2 focus:ring-[#1b7340] focus:border-[#1b7340] disabled:bg-gray-50 disabled:cursor-not-allowed"
            />

            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756d] hover:text-[#1b7340] transition disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1b7340] hover:bg-[#124d2a] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-[9px] text-base font-semibold transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}