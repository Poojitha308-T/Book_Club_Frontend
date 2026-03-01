// src/features/library/pages/LibraryPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getUserLibrary,
  removeBookFromLibrary,
  updateBookStatus,
} from "../library.api";
import LibraryCard from "../components/LibraryCard";

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const data = await getUserLibrary();
      setBooks(data || []);
    } catch (error) {
      toast.error("Failed to load library");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeBookFromLibrary(bookId);
      toast.success("Book removed from library");
      setBooks((prev) => prev.filter((b) => b.book_id !== bookId));
    } catch {
      toast.error("Failed to remove book");
    }
  };

  const handleStatusChange = async (bookId, status) => {
    try {
      await updateBookStatus(bookId, status);
      toast.success("Book status updated");
      // Update the book in local state without refetch
      setBooks((prev) =>
        prev.map((b) =>
          b.book_id === bookId ? { ...b, status } : b
        )
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredBooks =
    filter === "all" ? books : books.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-indigo-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">My Library</h1>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {["all", "reading", "completed", "to_read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No books in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <LibraryCard
                key={book.book_id}
                book={book}
                onRemove={handleRemove}
                onUpdateStatus={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;