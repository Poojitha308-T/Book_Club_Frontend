// src/components/layout/Sidebar.jsx
import { X, Book, Home, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navStyle = "flex items-center px-4 py-2 rounded-lg transition-all duration-200 font-medium";

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static`}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center px-4 py-4 lg:hidden border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 mt-4">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </NavLink>

          {/* Books */}
          <NavLink
            to="/books"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Book size={18} className="mr-2" />
            Books
          </NavLink>

          {/* Book Suggestions */}
          <NavLink
            to="/book-suggestions"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Book size={16} className="mr-2" />
            Book Suggestions
          </NavLink>

          {/* Users */}
          <NavLink
            to="/users"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Users size={18} className="mr-2" />
            Users
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;