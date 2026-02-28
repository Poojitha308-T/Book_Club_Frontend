import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BooksPage from "@/features/books/pages/BooksPage.jsx";
import BookDetailsPage from "@/features/books/pages/BookDetailsPage.jsx";

export const routes = [
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
    path: "/dashboard",
    element: <DashboardPage />,
    protected: true,
  },
  { path: "/books", element: <BooksPage /> },
  { path: "/books/:bookid", element: <BookDetailsPage /> },
];
