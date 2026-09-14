import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Menu, Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import { getSession, clearSession } from "../../utils/auth";

export default function AppLayout() {
  const navigate = useNavigate();
  const session = getSession();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const staffName = session?.staff?.name || "Staff";
  const staffEmail = session?.staff?.email || "";

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        storeName="CD Shopping Hub"
        staffName={staffName}
        staffEmail={staffEmail}
        onLogout={handleLogout}
      />

      <div className={`min-h-screen transition-all duration-200 ${collapsed ? "lg:ml-[78px]" : "lg:ml-[248px]"}`}>
        <header className="sticky top-0 z-30 h-[70px] bg-card/95 backdrop-blur-md border-b border-line">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 rounded-lg border border-line flex items-center justify-center text-ink-soft"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center w-[280px] h-10 px-3 rounded-lg bg-paper border border-line focus-within:border-brand-500 focus-within:bg-white transition">
              <Search className="w-4 h-4 text-ink-faint shrink-0" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full ml-2 bg-transparent outline-none text-xs text-ink placeholder:text-ink-faint"
              />
            </div>

            <button
              aria-label="Search"
              className="md:hidden w-10 h-10 rounded-lg border border-line flex items-center justify-center text-ink-soft"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              aria-label="Notifications"
              className="w-10 h-10 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:text-brand-700 hover:border-brand-500 transition ml-auto"
            >
              <Bell className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}