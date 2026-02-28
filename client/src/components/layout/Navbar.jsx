import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 border-b sticky top-0 z-20">
      <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Book Club Dashboard</h1>

      <div className="flex items-center space-x-4">
        <span className="hidden sm:block text-gray-500 text-sm">Welcome Back 👋</span>
        <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
          <LogOut size={16} className="mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;