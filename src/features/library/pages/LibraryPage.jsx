import { useEffect, useState } from "react";
import {
  getUserLibrary,
  removeBookFromLibrary,
} from "../library.api";

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const data = await getUserLibrary();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching library:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    await removeBookFromLibrary(bookId);
    fetchLibrary();
  };

  const filteredBooks =
    filter === "all"
      ? books
      : books.filter((b) => b.status === filter);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Library</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "reading", "completed", "to_read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 && (
          <p>No books in this category.</p>
        )}

        {filteredBooks.map((book) => (
          <div
            key={book.book_id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="font-semibold text-lg">
              {book.title}
            </h2>
            <p className="text-sm text-gray-500">
              {book.author}
            </p>

            <p className="mt-2 text-sm capitalize">
              Status: {book.status}
            </p>

            <button
              onClick={() => handleRemove(book.book_id)}
              className="mt-4 text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;