import api from "@/services/apiClient";

// GET reviews by bookId (query param)
export const getBookReviews = async (bookId) => {
  const res = await api.get("/reviews", { params: { bookId } });
  return res.data; // { success, reviews: [...] }
};

// POST review for a book
export const addBookReview = async (bookId, rating, comment) => {
  const res = await api.post(`/reviews/${bookId}`, { rating, comment });
  return res.data;
};