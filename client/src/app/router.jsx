import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

/* Public Pages */
import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import BookPage from "@/features/books/pages/BooksPage";
import BookDetailsPage from "@/features/books/pages/BookDetailsPage";

/* Protected Pages */
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BookSuggestionsPage from "@/features/suggestions/BookSuggestionsPage";
import UsersPage from "@/features/users/UsersPage";

/* New Modules */
import LibraryPage from "@/features/library/pages/LibraryPage";
// import GoalsPage from "@/features/goals/GoalsPage";
// import ProgressPage from "@/features/progress/ProgressPage";
// import MeetingsPage from "@/features/meetings/MeetingsPage";
// import NotificationsPage from "@/features/notifications/NotificationsPage";
// import RecommendationsPage from "@/features/recommendations/RecommendationsPage";

export const router = createBrowserRouter([
  /* ================= PUBLIC ROUTES ================= */
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/books",
    element: <BookPage />,
  },
  {
    path: "/books/:id",
    element: <BookDetailsPage />,
  },

  /* ================= PROTECTED ROUTES ================= */
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      /* ---- Dashboard ---- */
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },

      /* ---- Library ---- */
      {
        path: "/library",
        element: <LibraryPage />,
      },

      /* ---- Goals ---- */
      // {
      //   path: "/goals",
      //   element: <GoalsPage />,
      // },

      /* ---- Progress ---- */
      // {
      //   path: "/progress",
      //   element: <ProgressPage />,
      // },

      // /* ---- Meetings ---- */
      // {
      //   path: "/meetings",
      //   element: <MeetingsPage />,
      // },

      /* ---- Notifications ---- */
      // {
      //   path: "/notifications",
      //   element: <NotificationsPage />,
      // },

      /* ---- Recommendations ---- */
      // {
      //   path: "/recommendations",
      //   element: <RecommendationsPage />,
      // },

      /* ---- Suggestions ---- */
      {
        path: "/book-suggestions",
        element: <BookSuggestionsPage />,
      },

      /* ---- Admin Routes ---- */
      {
        path: "/admin/users",
        element: <UsersPage />,
      },
    ],
  },

  /* ================= 404 FALLBACK ================= */
  {
    path: "*",
    element: (
      <div className="p-10 text-center text-xl">404 - Page Not Found</div>
    ),
  },
]);
