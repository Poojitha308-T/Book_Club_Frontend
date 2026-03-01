// src/features/library/library.api.js
import apiClient from "@/services/apiClient";

/**
 * Get the current user's library
 * GET /library
 */
export const getUserLibrary = async () => {
  const res = await apiClient.get("/library");
  return res.data; // expecting array of books
};

/**
 * Add a book to the library or update status
 * POST /library
 * @param {string} bookId - ID of the book
 * @param {string} status - reading | completed | to_read (default: to_read)
 */
export const addBookToLibrary = async (bookId, status = "to_read") => {
  const res = await apiClient.post("/library", {
    book_id: bookId, // backend expects snake_case
    status,
  });
  return res.data;
};

/**
 * Remove a book from the library
 * DELETE /library
 * @param {string} bookId - ID of the book
 */
export const removeBookFromLibrary = async (bookId) => {
  const res = await apiClient.delete("/library", {
    data: { book_id: bookId },
  });
  return res.data;
};

/**
 * Update the status of a book in the library
 * PATCH /library/:bookId
 * @param {string} bookId
 * @param {string} status - reading | completed | to_read
 */
export const updateBookStatus = async (bookId, status) => {
  const res = await apiClient.patch(`/library/${bookId}`, { status });
  return res.data;
};