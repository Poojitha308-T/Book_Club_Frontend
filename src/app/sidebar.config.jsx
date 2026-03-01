import { Home, Book, BarChart2, Users, MessageSquare, Star } from "lucide-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
    roles: ["user", "admin"],
  },
  {
    label: "Books",
    path: "/books",
    icon: Book,
    roles: ["user", "admin"],
  },
  {
    label: "Suggestions & Voting",
    path: "/book-suggestions",
    icon: BarChart2,
    roles: ["user", "admin"],
  },
  {
    label: "Discussions",
    path: "/discussions",
    icon: MessageSquare,
    roles: ["user", "admin"],
  },
  {
    label: "Reviews",
    path: "/reviews",
    icon: Star,
    roles: ["user", "admin"],
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
];