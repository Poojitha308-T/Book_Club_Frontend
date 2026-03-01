import React from "react";
import SuggestionList from "./SuggestionList";

/**
 * BookSuggestionsPage
 * Main page for users to view and suggest books.
 * Admins can approve suggestions.
 */
const BookSuggestionsPage = () => {
  // Get current user info (role) from localStorage or auth context
  const user = {
    role: localStorage.getItem("role") || "user",
    name: localStorage.getItem("name") || "Guest",
    email: localStorage.getItem("email") || "",
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Book Suggestions
      </h1>

      {/* Suggestion List & Admin Actions */}
      <SuggestionList user={user} />
    </div>
  );
};

export default BookSuggestionsPage;