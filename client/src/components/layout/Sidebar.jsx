import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navStyle =
    "flex items-center px-4 py-2 rounded-lg transition-all duration-200";

  return (
    <>
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Close Button Mobile */}
        <div className="flex justify-between items-center px-4 py-4 lg:hidden">
          <h2 className="font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/books"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Books
          </NavLink>

          <NavLink
            to="/users"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${navStyle} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            Users
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;