import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookReviews, addBookReview } from "@/features/reviews/reviews.api";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

const ReviewDetailsPage = () => {
  const { bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getBookReviews(bookId);
      setReviews(data);
    } catch (err) {
      console.error("Fetch reviews failed:", err);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Write a review before submitting");
      return;
    }

    setAdding(true);
    try {
      await addBookReview(bookId, rating, reviewText);
      toast.success("Review added!");
      setReviewText("");
      setRating(5);
      fetchReviews(); // refresh the list
    } catch (err) {
      console.error("Add review failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Book Reviews</h2>

      {/* Add Review Form */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <label className="block font-medium">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleAddReview}
          disabled={adding}
          className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition ${
            adding ? "cursor-not-allowed bg-gray-400" : ""
          }`}
        >
          {adding ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Reviews</h3>
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border p-3 rounded-lg bg-white shadow-sm">
              <StarRating rating={r.rating} />
              <p className="mt-1">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">By: {r.user_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewDetailsPage;