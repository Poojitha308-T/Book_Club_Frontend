import api from "../../lib/axios";

// GET reviews by bookId (query param)
export const getBookReviews = async (bookId) => {
  const res = await api.get("/reviews", { params: { bookId } });
  return res.data;
};

// POST review for a book (URL param must match backend)
export const addBookReview = async (bookId, rating, comment) => {
  try {
    // ⚡ URL includes bookId as param
    const res = await api.post(`/reviews/${bookId}`, { rating, comment });
    return res.data;
  } catch (err) {
    console.error(`Failed to add review for book ${bookId}`, err);
    throw err;
  }
};