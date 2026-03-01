import apiClient from "./apiClient";

// Create a new book
export const createBook = async (bookData) => {
  const res = await apiClient.post("/books", bookData);
  return res.data; // You can return the created book if needed
};

// Fetch all books
export const getBooks = async () => {
  const res = await apiClient.get("/books");
  return res.data.books;
};

// Get book by ID
export const getBookById = async (id) => {
  const res = await apiClient.get(`/books/${id}`);
  return res.data.book;
};

// Update book
export const updateBook = async (id, bookData) => {
  const res = await apiClient.put(`/books/${id}`, bookData);
  return res.data;
};

// Delete book
export const deleteBook = async (id) => {
  const res = await apiClient.delete(`/books/${id}`);
  return res.data;
};