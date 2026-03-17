import React, { useContext } from "react";
import { Menu, LogOut, User, Bell, Search, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "@/context/ThemeContext";

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 
      bg-white/80 dark:bg-slate-900/80 
      backdrop-blur-md 
      border-b border-slate-200 dark:border-slate-800 
      z-40 flex items-center justify-between px-6 transition-all duration-300"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-sm">
          <Search size={16} className="text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="bg-transparent border-none outline-none text-xs ml-2 w-48 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* 🌙☀️ THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:rotate-12"
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon size={18} className="fill-slate-500" />
          ) : (
            <Sun size={18} className="text-yellow-400 fill-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="hidden sm:block p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* User Section */}
        <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-slate-100 dark:border-slate-800">
          {/* Name + Role */}
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">
              {userName}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter font-medium">
              {userRole || "Member"}
            </p>
          </div>

          {/* Avatar */}
          <div className="group relative cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold ring-4 ring-indigo-50 dark:ring-indigo-900/20">
              <User size={18} />
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
