import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let userName = "User";
  let userRole = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      userName = decoded?.name || decoded?.username || decoded?.email || "User";

      userRole = decoded?.role || "";
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      className="h-16 
      bg-white/80 dark:bg-gray-900/80 
      backdrop-blur-xl 
      border-b border-white/20 dark:border-white/10 
      shadow-md 
      flex items-center justify-between px-6 
      sticky top-0 z-20"
    >
      <button
        className="lg:hidden text-gray-600 dark:text-gray-300"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-slate-800 dark:text-white hidden sm:block tracking-wide">
        Book Club Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            <User size={16} />
          </div>

          <div className="text-sm">
            <p className="text-slate-800 dark:text-slate-100 font-semibold">
              {userName}
            </p>

            <div className="flex items-center gap-2 mt-1">
              {userRole && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${
            userRole === "admin"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          }`}
                >
                  {userRole.toUpperCase()}
                </span>
              )}

              <span className="text-xs text-slate-400">Welcome back 👋</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-xl hover:bg-red-600 shadow-md transition-all duration-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
