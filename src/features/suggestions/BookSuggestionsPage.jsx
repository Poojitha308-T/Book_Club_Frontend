import React from "react";
import SuggestionList from "./SuggestionList";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import

const BookSuggestionsPage = () => {
  const token = localStorage.getItem("token");

  let user = {
    role: "user",
    name: "Guest",
    email: "",
  };

  if (token) {
    try {
      const decoded = jwtDecode(token);

      user = {
        role: decoded?.role || "user",
        name: decoded?.name || "User",
        email: decoded?.email || "",
      };
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Book Suggestions
      </h1>

      <SuggestionList user={user} />
    </div>
  );
};

export default BookSuggestionsPage;