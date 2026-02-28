import apiClient from "@/services/apiClient";

export const getAllBooks = async (page = 1) => {
  const res = await apiClient.get(`/books?page=${page}`);
  return res.data;
};

export const getBookById = async (id) => {
  const res = await apiClient.get(`/books/${id}`);
  return res.data;
};

export const createBook = async (data) => {
  const res = await apiClient.post("/books", data);
  return res.data;
};

export const updateBook = async (id, data) => {
  const res = await apiClient.put(`/books/${id}`, data);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await apiClient.delete(`/books/${id}`);
  return res.data;
};