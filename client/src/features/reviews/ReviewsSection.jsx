import { useEffect, useState } from "react";
import { getBookReviews, addBookReview } from "@/features/reviews/reviews.api";
import { getUserLibrary } from "@/features/library/library.api";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

const ReviewsSection = () => {
  const [library, setLibrary] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);

  // Fetch user library and all books with average ratings
  useEffect(() => {
    const fetchLibraryAndBooks = async () => {
      try {
        const libRes = await getUserLibrary();
        const libBooks = libRes.library ?? [];
        setLibrary(libBooks);

        // Fetch all books with avg ratings
        const booksRes = await fetchBooksWithRatings(libBooks);
        setBooks(booksRes);
      } catch (err) {
        console.error("Failed to fetch library or books:", err);
      }
    };
    fetchLibraryAndBooks();
  }, []);

  const fetchBooksWithRatings = async (libBooks) => {
    try {
      // You can optimize by fetching only books not in library if needed
      return await Promise.all(
        libBooks.map(async (b) => {
          const revRes = await getBookReviews(b.book_id);
          const reviews = revRes.reviews ?? [];
          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : null;
          return { ...b, avgRating };
        }),
      );
    } catch (err) {
      console.error("Failed to fetch book ratings:", err);
      return libBooks;
    }
  };

  const fetchReviews = async (bookId) => {
    if (!bookId) return;
    try {
      const res = await getBookReviews(bookId);
      setReviews(res.reviews ?? []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleAddReview = async () => {
    if (!selectedBook || !reviewText.trim()) {
      toast.error("Select a book and write a review!");
      return;
    }

    try {
      const res = await addBookReview(selectedBook, rating, reviewText);
      if (res.success) {
        toast.success("Review added!");
        setReviewText("");
        setRating(5);
        fetchReviews(selectedBook); // refresh reviews
      } else {
        toast.error(res.message || "Failed to add review");
      }
    } catch (err) {
      toast.error("Failed to add review");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-700">Book Reviews</h2>

      {/* Select Book Dropdown */}
      <select
        className="w-full border p-2 rounded"
        value={selectedBook}
        onChange={(e) => {
          setSelectedBook(e.target.value);
          fetchReviewsForBook(e.target.value);
        }}
      >
        <option value="">Select Book</option>
        {library
          .filter((b) => b.title) // ensure the book has a title
          .map((b) => (
            <option key={b.book_id} value={b.book_id}>
              {b.title}
              {b.avgRating != null ? ` - ${b.avgRating.toFixed(1)} ⭐` : ""}
            </option>
          ))}
      </select>

      {/* Add Review */}
      <div className="space-y-2">
        <label className="block font-medium">Rating:</label>
        <select
          className="border p-1 rounded"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <button
          onClick={handleAddReview}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Review
        </button>
      </div>

      {/* Display Reviews */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-slate-400">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border p-2 rounded">
              <StarRating rating={r.rating} />
              <p>{r.reviewText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
