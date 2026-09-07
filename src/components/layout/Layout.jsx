import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Store,
  LogOut,
  User,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "lg:ml-[82px]" : "lg:ml-[260px]"}
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-[78px] bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-green-700 hover:bg-green-50 transition"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 truncate">
                  Admin Panel
                </h1>

                <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
                  Welcome back, manage your store from here
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Search */}
              <div className="hidden md:flex items-center w-[220px] lg:w-[280px] h-10 px-3 rounded-xl bg-gray-50 border border-gray-100 focus-within:border-green-200 focus-within:bg-white transition">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />

                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full ml-2 bg-transparent outline-none text-xs text-gray-700 placeholder:text-gray-400"
                />

                <span className="hidden lg:block text-[9px] text-gray-400 border border-gray-200 bg-white rounded px-1.5 py-0.5">
                  ⌘ K
                </span>
              </div>

              {/* Mobile Search */}
              <button className="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-700 transition">
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Notification */}
              <button className="relative w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-700 transition">
                <Bell className="w-[18px] h-[18px]" />

                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
              </button>

              <div className="hidden sm:block h-8 w-px bg-gray-200 mx-1" />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 hover:bg-gray-50 transition"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      AS
                    </div>

                    <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-gray-900">
                      Admin Seller
                    </p>

                    <p className="text-[10px] text-gray-400">
                      Store Manager
                    </p>
                  </div>

                  <ChevronDown
                    className={`
                      hidden sm:block w-4 h-4 text-gray-400
                      transition-transform duration-200
                      ${profileOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 top-14 z-50 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-2">
                      <div className="px-3 py-3 border-b border-gray-100 mb-1">
                        <p className="text-sm font-bold text-gray-900">
                          Admin Seller
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          seller@cdshopping.com
                        </p>
                      </div>

                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-gray-600 hover:bg-green-50 hover:text-green-700 transition">
                        <User className="w-4 h-4" />
                        My Profile
                      </button>

                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-gray-600 hover:bg-green-50 hover:text-green-700 transition">
                        <Store className="w-4 h-4" />
                        Store Settings
                      </button>

                      <div className="h-px bg-gray-100 my-1" />

                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}