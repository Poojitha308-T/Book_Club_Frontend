import { X, Book, Home, Users, BarChart2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navStyle =
    "flex items-center px-4 py-2 rounded-lg transition-all duration-200 font-medium";

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300
       ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
  `}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center px-4 py-4 lg:hidden border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="/books"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <Book size={18} className="mr-2" />
            Books
          </NavLink>

          <NavLink
            to="/book-suggestions"
            className={({ isActive }) =>
              `${navStyle} ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <BarChart2 size={18} className="mr-2" />
            Suggestions & Voting
          </NavLink>

          <NavLink
            to="/admin/users"
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
