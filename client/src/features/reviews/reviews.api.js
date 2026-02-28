import api from "../../lib/axios";

// GET /reviews/:bookId
export const getBookReviews = async (bookId) => {
  const res = await api.get(`/reviews/${bookId}`);
  return res.data; // should return { reviews: [...] }
};

// POST /reviews/:bookId
export const addBookReview = async (bookId, rating, comment) => {
  const res = await api.post(`/reviews/${bookId}`, {
    rating,
    comment,
  });
  return res.data; // should return { success: true }
};