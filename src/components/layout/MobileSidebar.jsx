import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, BookOpen, MessageSquare, Star, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileSidebar = () => {
  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-700 transition";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
          <Menu size={22} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64">
        <h2 className="text-lg font-bold mb-6">📖 Menu</h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/books" className={linkClass}>
            <BookOpen size={18} /> Books
          </NavLink>
          <NavLink to="/discussions" className={linkClass}>
            <MessageSquare size={18} /> Discussions
          </NavLink>
          <NavLink to="/reviews" className={linkClass}>
            <Star size={18} /> Reviews
          </NavLink>
          <NavLink to="/achievements" className={linkClass}>
            <Trophy size={18} /> Achievements
          </NavLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;