import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BooksPage from "@/features/books/pages/BooksPage.jsx";
import BookDetailsPage from "@/features/books/pages/BookDetailsPage.jsx";
import BookSuggestionsPage from "@/features/suggestions/BookSuggestionsPage";
import UsersPage from "@/features/users/UsersPage";
import LibraryPage from "@/features/library/pages/LibraryPage";

// New modules
import GoalsPage from "@/features/goals/pages/GoalsPage";
import AchievementsPage from "@/features/achievements/pages/AchievementsPage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import MeetingsPage from "@/features/meetings/pages/MeetingsPage";

import AppLayout from "./AppLayout";

// Define all routes
export const routes = [
  /* ================= PUBLIC ROUTES ================= */
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/books", element: <BooksPage /> },
  { path: "/books/:bookid", element: <BookDetailsPage /> },

  /* ================= PROTECTED ROUTES ================= */
  {
    element: <AppLayout />, // Wrapper layout for protected routes
    protected: true,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/library", element: <LibraryPage /> },
      { path: "/book-suggestions", element: <BookSuggestionsPage /> },
      { path: "/goals", element: <GoalsPage /> },
      { path: "/achievements", element: <AchievementsPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/meetings", element: <MeetingsPage /> },
      { path: "/admin/users", element: <UsersPage />, requiredRole: "admin" },
    ],
  },

  /* ================= 404 FALLBACK ================= */
  { path: "*", element: <div className="p-10 text-center text-xl">404 - Page Not Found</div> },
];