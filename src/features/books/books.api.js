// src/services/books.api.js
import apiClient from "@/services/apiClient";

// Fetch all books (optionally paginated)
export const getAllBooks = async (page = 1) => {
  const res = await apiClient.get(`/books?page=${page}`);
  return res.data;
};

// Fetch a single book by ID
export const getBookById = async (id) => {
  const res = await apiClient.get(`/books/${id}`);
  return res.data;
};

// Create a new book
export const createBook = async (data) => {
  const res = await apiClient.post("/books", data);
  return res.data;
};

// Update an existing book
export const updateBook = async (id, data) => {
  const res = await apiClient.put(`/books/${id}`, data);
  return res.data;
};

// Delete a book
export const deleteBook = async (id) => {
  const res = await apiClient.delete(`/books/${id}`);
  return res.data;
};