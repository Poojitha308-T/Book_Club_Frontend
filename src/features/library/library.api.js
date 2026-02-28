
import API from './../../lib/axios';

// GET /library
export const getUserLibrary = async () => {
  const res = await API.get("/library");
  return res.data;
};

// POST /library
export const addBookToLibrary = async (bookId, status = "to_read") => {
  const res = await API.post("/library", {
    bookId,   // 🔹 maybe backend wants camelCase
    status,
  });
  return res.data;
};
// DELETE /library
export const removeBookFromLibrary = async (bookId) => {
  const res = await API.delete("/library", { data: { book_id: bookId } });
  return res.data;
};