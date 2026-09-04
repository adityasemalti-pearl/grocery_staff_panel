import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children, staffName = "Staff" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <header className="bg-white border-b border-[#dde3dc] px-5 py-3.5">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between flex-wrap gap-3">
          
          <div className="font-['Baloo_2'] font-bold text-[19px]">
            CD Shopping Hub{" "}
            <span className="text-[#1b7340] font-['Karla'] font-semibold text-sm ml-1 uppercase tracking-wider">
              Staff
            </span>
          </div>

          <nav className="flex gap-1">
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                location.pathname === "/orders"
                  ? "bg-[#1b7340] text-white"
                  : "text-[#5b6960] hover:bg-[#f7f8f4]"
              }`}
            >
              Orders
            </Link>

            <Link
              to="/products"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                location.pathname === "/products"
                  ? "bg-[#1b7340] text-white"
                  : "text-[#5b6960] hover:bg-[#f7f8f4]"
              }`}
            >
              Products
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-sm text-[#5b6960]">
            <span>{staffName}</span>

            <button
              onClick={logout}
              className="underline hover:text-[#1b7340]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}