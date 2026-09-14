import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tags,
  BookMarked,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Store,
} from "lucide-react";

// Kept in sync with the routes registered in App.jsx — a nav item that
// points at a route which doesn't exist is worse than no nav item.
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Categories", icon: Tags, path: "/categories" },
  { label: "Brands", icon: BookMarked, path: "/brand" },
  { label: "Customers", icon: Users, path: "/customers" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  storeName,
  staffName,
  staffEmail,
  onLogout,
}) {
  const closeOnMobile = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] lg:hidden"
          onClick={closeOnMobile}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen bg-card border-r border-line
          flex flex-col transition-all duration-200 ease-out
          ${collapsed ? "w-[78px]" : "w-[248px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className={`h-[70px] flex items-center border-b border-line ${collapsed ? "justify-center px-3" : "px-5"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-brand-600 flex items-center justify-center">
              <Store className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-extrabold text-ink truncate">
                  {storeName}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                  Seller Hub
                </p>
              </div>
            )}
          </div>

          <button
            onClick={closeOnMobile}
            aria-label="Close menu"
            className="ml-auto lg:hidden w-8 h-8 rounded-lg hover:bg-paper flex items-center justify-center text-ink-soft"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeOnMobile}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `
                  group relative flex items-center rounded-lg transition-colors
                  ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"}
                  ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                  }
                `}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && (
                  <span className="text-[13px] font-semibold">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings + account */}
        <div className="border-t border-line px-3 py-3 space-y-1">
          <NavLink
            to="/settings"
            onClick={closeOnMobile}
            title={collapsed ? "Settings" : undefined}
            className={({ isActive }) => `
              flex items-center rounded-lg transition-colors
              ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"}
              ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              }
            `}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            {!collapsed && <span className="text-[13px] font-semibold">Settings</span>}
          </NavLink>

          <div className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 shrink-0 rounded-full bg-brand-600 text-white text-[11px] font-extrabold flex items-center justify-center">
              {staffName.slice(0, 2).toUpperCase()}
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{staffName}</p>
                  <p className="text-[10px] text-ink-faint truncate">{staffEmail}</p>
                </div>

                <button
                  onClick={onLogout}
                  title="Log out"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-rose-50 hover:text-rose-500 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-[78px] w-6 h-6 rounded-full bg-card border border-line items-center justify-center text-ink-soft hover:text-brand-700 hover:border-brand-500 transition"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
}