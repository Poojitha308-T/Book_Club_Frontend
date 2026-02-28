// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import BookSuggestionsPage from "../features/suggestions/BookSuggestionsPage";
import UsersPage from "@/features/users/UsersPage";
import BooksPage from "@/features/books/pages/BooksPage";

// Optional: friendly 404 page
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-screen text-gray-700">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl">Oops! Page not found.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes inside AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} /> 
          <Route path="/book-suggestions" element={<BookSuggestionsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          {/* Add more protected routes here */}
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;