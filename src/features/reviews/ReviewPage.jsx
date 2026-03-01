import { useEffect, useState } from "react";
import { getUserLibrary } from "@/features/library/library.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewsPage = () => {
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await getUserLibrary();
        const libBooks = res.library ?? [];
        setLibrary(libBooks);

        // Precompute average ratings if included in backend
        setBooks(libBooks);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch library");
      }
    };
    fetchLibrary();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Library - Reviews</h2>
      {books.length === 0 ? (
        <p className="text-gray-500">No books in your library yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div
              key={book.book_id}
              className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/reviews/${book.book_id}`)}
            >
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              {book.avgRating != null && (
                <p className="text-yellow-500">{book.avgRating.toFixed(1)} ⭐</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;