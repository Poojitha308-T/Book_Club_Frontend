// src/features/library/library.api.js
import api from "@/lib/axios";

// Get the logged-in user's library
export const getUserLibrary = async () => {
  try {
    const res = await api.get("/library");
    return res.data; // { success, library }
  } catch (err) {
    console.error("Failed to fetch user library:", err);
    throw err;
  }
};

// Add a book to the library
export const addBookToLibrary = async (bookId) => {
  try {
    if (!bookId) throw new Error("bookId is required");

    const res = await api.post("/library", { bookId });
    return res.data; // { success, book/message }
  } catch (err) {
    console.error("Failed to add book to library:", err);
    throw err;
  }
};

// Remove a book from the library
export const removeBookFromLibrary = async (bookId) => {
  try {
    if (!bookId) throw new Error("bookId is required");

    const res = await api.delete("/library", { data: { bookId } });
    return res.data; // { success, book }
  } catch (err) {
    console.error("Failed to remove book from library:", err);
    throw err;
  }
};