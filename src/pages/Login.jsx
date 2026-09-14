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
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearErrorOnChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password to continue.");
      return;
    }

    try {
      setLoading(true);

      const response = await staffLogin({
        username: username.trim(),
        password,
      });

      if (!response?.success || !response?.data?.accessToken) {
        throw new Error(response?.message || "Login failed. Please try again.");
      }

      saveSession({
        accessToken: response.data.accessToken,
        staff: response.data.staff,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Unable to sign in. Please try again.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1050px] min-h-[600px] bg-card rounded-2xl overflow-hidden shadow-float border border-line grid lg:grid-cols-2">
        {/* Brand panel — desktop only */}
        <div className="hidden lg:flex relative bg-brand-800 p-12 flex-col justify-between overflow-hidden">
          <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-brand-500/10" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-black/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-800" />
            </div>
            <div>
              <h2 className="text-white text-lg font-extrabold">CD Shopping Hub</h2>
              <p className="text-brand-100/70 text-[10px] font-bold uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-brand-50 text-xs font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure admin access
            </div>

            <h1 className="text-white text-4xl xl:text-5xl font-extrabold leading-tight">
              Manage your store.
              <br />
              <span className="text-brand-200">Grow your business.</span>
            </h1>

            <p className="text-brand-50/70 text-sm leading-6 mt-5 max-w-[380px]">
              Manage products, orders, customers and your entire shopping
              operation from one dashboard.
            </p>

            <div className="mt-8 space-y-4">
              <Feature icon={ShoppingBag} title="Manage orders" text="Track and fulfill customer orders" />
              <Feature icon={BarChart3} title="Store analytics" text="Monitor how your store is performing" />
              <Feature icon={LockKeyhole} title="Secure dashboard" text="Protected access for store staff" />
            </div>
          </div>

          <p className="relative z-10 text-[11px] text-brand-50/50">
            © 2026 CD Shopping Hub. All rights reserved.
          </p>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-[380px]">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-ink">CD Shopping Hub</h2>
                <p className="text-[10px] text-ink-faint font-bold uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
            </div>

            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
              <LockKeyhole className="w-5 h-5 text-brand-700" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Welcome back</h1>
            <p className="text-sm text-ink-soft mt-2 mb-7">
              Sign in to access your admin dashboard.
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-rose-50 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" spellCheck={false}>
              <Field label="Username">
                <Input
                  autoComplete="off"
                  value={username}
                  onChange={clearErrorOnChange(setUsername)}
                  disabled={loading}
                  placeholder="Enter your username"
                />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={clearErrorOnChange(setPassword)}
                    disabled={loading}
                    placeholder="Enter your password"
                    className="pr-11"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:text-brand-700 hover:bg-brand-50 transition disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </Field>

              <Button
                type="submit"
                loading={loading}
                icon={loading ? undefined : ArrowRight}
                className="w-full mt-2"
                size="lg"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-8">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <p className="text-[11px] text-ink-faint">
                Your account is protected with secure authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-brand-100">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="text-[10px] text-brand-50/50 mt-0.5">{text}</p>
      </div>
    </div>
  );
}