// src/features/discussions/discussions.api.js
import apiClient from "@/services/apiClient";

// Fetch all discussion threads
export const getThreads = async () => {
  const res = await apiClient.get("/discussions");
  return res.data; // array of threads
};

// Fetch single thread details (with comments)
export const getThreadById = async (threadId) => {
  const res = await apiClient.get(`/discussions/${threadId}`);
  return res.data;
};

// Create a new thread
export const createThread = async (data) => {
  const res = await apiClient.post("/discussions", data);
  return res.data;
};

// Post a comment/reply
export const postComment = async (data) => {
  const res = await apiClient.post("/discussions/comments", data);
  return res.data;
};