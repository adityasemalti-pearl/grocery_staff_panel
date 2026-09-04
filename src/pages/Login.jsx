import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffLogin } from "../api/authApis";
import { saveSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      if (
        !response?.success ||
        !response?.data?.accessToken
      ) {
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

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message
      );
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

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <label
            htmlFor="username"
            className="block text-[13px] font-semibold text-[#5b6960] mb-1.5"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            autoComplete="username"
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
            htmlFor="password"
            className="block text-[13px] font-semibold text-[#5b6960] mb-1.5"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (error) {
                setError("");
              }
            }}
            disabled={loading}
            placeholder="Enter password"
            className="w-full px-3.5 py-3 border border-[#dde3dc] rounded-[9px] text-base mb-[18px] outline-none focus:ring-2 focus:ring-[#1b7340] focus:border-[#1b7340] disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

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