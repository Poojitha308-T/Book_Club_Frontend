import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBookReviews, addBookReview } from "./reviews.api";
import { getUserLibrary } from "@/features/library/library.api";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

const ReviewsSection = () => {
  const [library, setLibrary] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [booksWithRatings, setBooksWithRatings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const libRes = await getUserLibrary();
        const libBooks = libRes.library ?? [];
        setLibrary(libBooks);

        // Fetch reviews for each book to calculate average rating
        const booksWithAvg = await Promise.all(
          libBooks.map(async (b) => {
            const res = await getBookReviews(b.book_id);
            const revs = res.reviews ?? [];
            const avg =
              revs.length > 0
                ? revs.reduce((sum, r) => sum + r.rating, 0) / revs.length
                : 0;
            return { ...b, avgRating: avg };
          })
        );
        setBooksWithRatings(booksWithAvg);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch library or ratings");
      }
    };
    fetchLibrary();
  }, []);

  const fetchReviews = async (bookId) => {
    if (!bookId) return;
    try {
      const res = await getBookReviews(bookId);
      setReviews(res.reviews ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    }
  };

  const handleAddReview = async () => {
    if (!selectedBook || !reviewText.trim()) {
      toast.error("Select a book and write a review");
      return;
    }

    try {
      const res = await addBookReview(selectedBook, rating, reviewText);
      if (res.success) {
        toast.success("Review added!");
        setReviewText("");
        setRating(5);
        fetchReviews(selectedBook);
      } else {
        toast.error(res.message || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-700">Book Reviews</h2>

      {/* Select Book */}
      <select
        value={selectedBook}
        onChange={(e) => {
          setSelectedBook(e.target.value);
          fetchReviews(e.target.value);
        }}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Book</option>
        {booksWithRatings.map((b) => (
          <option key={b.book_id} value={b.book_id}>
            {b.title} {b.avgRating > 0 ? `- ${b.avgRating.toFixed(1)} ⭐` : ""}
          </option>
        ))}
      </select>

      {/* Add Review */}
      {selectedBook && (
        <div className="space-y-2 bg-white p-4 rounded-xl shadow-md">
          <label className="block font-medium">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-1 rounded"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleAddReview}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-xl shadow space-y-1">
              <div className="flex justify-between items-center">
                <StarRating rating={r.rating} />
                <span className="text-xs text-gray-400">{r.user_name}</span>
              </div>
              <p>{r.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View All Reviews Button */}
      {selectedBook && (
        <button
          onClick={() => navigate(`/reviews/${selectedBook}`)}
          className="text-blue-600 hover:underline"
        >
          View All Reviews
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;