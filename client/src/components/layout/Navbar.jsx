import { Menu } from "lucide-react";

const Navbar = ({ setSidebarOpen }) => {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      
      {/* Mobile Hamburger */}
      <button
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">
        Book Club Dashboard
      </h1>

      <div className="text-sm text-gray-500">
        Welcome Back 👋
      </div>
    </header>
  );
};

export default Navbar;