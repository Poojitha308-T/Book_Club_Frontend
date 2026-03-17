import {
  X,
  Book,
  Home,
  Users,
  BarChart2,
  Trophy,
  Bell,
  CalendarCheck,
  CheckSquare,
  Layers
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navStyle =
    "flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium group mb-1";
  
  const activeStyle = "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none";
  const inactiveStyle = "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600";

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 
        bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 flex flex-col`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layers className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
              Book<span className="text-indigo-600">Hub</span>
            </span>
          </div>
          <button className="lg:hidden ml-auto p-1" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">
            Main Menu
          </div>
          
          <div className="space-y-1">
            <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/books" icon={<Book size={20} />} label="Books Library" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/library" icon={<CheckSquare size={20} />} label="My Collection" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/book-suggestions" icon={<BarChart2 size={20} />} label="Suggestions" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4 px-4">
            Social & Goals
          </div>
          
          <div className="space-y-1">
            <NavItem to="/goals" icon={<CheckSquare size={20} />} label="Reading Goals" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/achievements" icon={<Trophy size={20} />} label="Achievements" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/notifications" icon={<Bell size={20} />} label="Updates" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
            <NavItem to="/meetings" icon={<CalendarCheck size={20} />} label="Club Meetings" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4 px-4">
            Admin
          </div>
          <NavItem to="/admin/users" icon={<Users size={20} />} label="User Management" style={navStyle} active={activeStyle} inactive={inactiveStyle} />
        </nav>

        {/* Bottom Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Reading Pro</p>
            <p className="text-[10px] text-slate-500 mt-1">Check your monthly stats.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

// Helper component for cleaner code
const NavItem = ({ to, icon, label, style, active, inactive }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${style} ${isActive ? active : inactive}`}
  >
    <span className="mr-3">{icon}</span>
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default Sidebar;