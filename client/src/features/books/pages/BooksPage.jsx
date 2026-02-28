import { useEffect, useState } from "react";
import { getAllBooks } from "../books.api";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
  try {
    const res = await getAllBooks();
    console.log("BOOK RESPONSE:", res);

    setBooks(res.books || []);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch books");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Books</h1>

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookPage;
