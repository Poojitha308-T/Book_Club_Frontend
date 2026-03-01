import api from "@/services/apiClient";

// GET reviews for a specific book
export const getBookReviews = async (bookId) => {
  const res = await api.get(`/books/${bookId}/reviews`);
  return res.data.reviews ?? []; // return an array
};

// POST review for a specific book
export const addBookReview = async (bookId, rating, reviewText) => {
  if (!reviewText.trim()) throw new Error("Review cannot be empty");

  const res = await api.post(`/books/${bookId}/reviews`, {
    book_id: bookId,    // backend expects 'book_id'
    content: reviewText, // backend expects 'content'
    rating: Number(rating),
  });

  return res.data.review; // backend returns { success: true, review: {...} }
};