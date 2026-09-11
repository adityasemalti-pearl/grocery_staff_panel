import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Tags,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Store,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    path: "/orders",
    badge: "12",
  },
  {
    label: "Products",
    icon: Package,
    path: "/products",
  },
  {
    label: "Inventory",
    icon: Boxes,
    path: "/inventory",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    label: "Categories",
    icon: Tags,
    path: "/categories",
  },
   {
    label: "Brand",
    icon: Tags,
    path: "/brand",
  },

//   {
//     label: "Analytics",
//     icon: BarChart3,
//     path: "/analytics",
//   },
];

const bottomItems = [
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    badge: "4",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}) {
  const currentPath = window.location.pathname;

  const isActive = (path) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/";
    }

    return currentPath.startsWith(path);
  };

  const handleNavigation = (path) => {
    window.location.href = path;

    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out
          flex flex-col
          ${collapsed ? "w-[82px]" : "w-[260px]"}
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div
          className={`
            h-[78px] flex items-center border-b border-gray-100
            ${collapsed ? "justify-center px-3" : "px-6"}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center shadow-lg shadow-green-700/20">
              <Store className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-[17px] font-extrabold tracking-tight text-gray-900">
                  CD Shopping
                </h1>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-green-600">
                  Seller Hub
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="ml-auto lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Profile */}
        {!collapsed ? (
          <div className="px-4 pt-5">
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-green-100 flex items-center justify-center shadow-sm">
                  <Store className="w-5 h-5 text-green-700" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-gray-500 font-medium">
                    Store
                  </p>

                  <p className="text-sm font-bold text-gray-900 truncate">
                    FreshMart Grocery
                  </p>
                </div>

                <ChevronDown className="w-4 h-4 text-green-700" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center pt-5">
            <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-green-700" />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6 scrollbar-hide">
          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Main Menu
            </p>
          )}

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  title={collapsed ? item.label : ""}
                  className={`
                    group relative w-full flex items-center
                    rounded-xl transition-all duration-200
                    ${
                      collapsed
                        ? "justify-center px-2 py-3"
                        : "gap-3 px-3.5 py-3"
                    }
                    ${
                      active
                        ? "bg-green-700 text-white shadow-md shadow-green-700/15"
                        : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }
                  `}
                >
                  {/* Active Indicator */}
                  {active && !collapsed && (
                    <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-green-500" />
                  )}

                  <Icon
                    className={`
                      w-[19px] h-[19px] shrink-0
                      ${
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-green-600"
                      }
                    `}
                    strokeWidth={active ? 2.3 : 2}
                  />

                  {!collapsed && (
                    <>
                      <span
                        className={`flex-1 text-left text-[13px] ${
                          active ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`
                            min-w-5 h-5 px-1.5 rounded-full
                            flex items-center justify-center
                            text-[10px] font-bold
                            ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Collapsed Badge */}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-600 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Management */}
          {!collapsed && (
            <p className="px-3 mt-8 mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Management
            </p>
          )}

          <nav className="space-y-1.5">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  title={collapsed ? item.label : ""}
                  className={`
                    group relative w-full flex items-center
                    rounded-xl transition-all duration-200
                    ${
                      collapsed
                        ? "justify-center px-2 py-3"
                        : "gap-3 px-3.5 py-3"
                    }
                    ${
                      active
                        ? "bg-green-700 text-white shadow-md shadow-green-700/15"
                        : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }
                  `}
                >
                  {active && !collapsed && (
                    <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-green-500" />
                  )}

                  <Icon
                    className={`
                      w-[19px] h-[19px] shrink-0
                      ${
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-green-600"
                      }
                    `}
                    strokeWidth={active ? 2.3 : 2}
                  />

                  {!collapsed && (
                    <>
                      <span
                        className={`flex-1 text-left text-[13px] ${
                          active ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`
                            min-w-5 h-5 px-1.5 rounded-full
                            flex items-center justify-center
                            text-[10px] font-bold
                            ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Seller Profile */}
        <div className="border-t border-gray-100 p-3">
          <div
            className={`
              flex items-center gap-3 rounded-xl
              ${collapsed ? "justify-center p-2" : "p-2.5"}
              hover:bg-gray-50 transition
            `}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                AS
              </div>

              <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    Admin Seller
                  </p>

                  <p className="text-[10px] text-gray-400 truncate">
                    seller@cdshopping.com
                  </p>
                </div>

                <button
                  title="Logout"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-[86px] w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-green-700 hover:border-green-200 transition"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </aside>
    </>
  );
}