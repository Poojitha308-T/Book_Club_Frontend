
import api from './../../lib/axios';

// GET /library
export const getUserLibrary = async () => {
  const res = await api.get("/library");
  return res.data;
};

// POST /library
export const addBookToLibrary = async (bookId, status = "to_read") => {
  const res = await api.post("/library", {
    bookId,   // 🔹 maybe backend wants camelCase
    status,
  });
  return res.data;
};
// DELETE /library
export const removeBookFromLibrary = async (bookId) => {
  const res = await api.delete("/library", { data: { book_id: bookId } });
  return res.data;
};