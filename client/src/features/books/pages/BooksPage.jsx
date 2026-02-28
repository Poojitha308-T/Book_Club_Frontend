import { useEffect, useState } from "react";
import { getAllBooks } from "../books.api";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await getAllBooks(currentPage);

      setBooks(res.books || []);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  if (loading)
    return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Books</h1>

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookPage;