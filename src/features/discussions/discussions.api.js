// src/features/discussions/discussions.api.js
import apiClient from "@/services/apiClient";

// Create a new thread
export const createThread = async ({ bookId, title }) => {
  const res = await apiClient.post("/discussions", { bookId, title });
  return res.data.thread;
};

// Get threads for a book (with pagination)
export const getThreadsByBook = async ({ bookId, limit = 10, page = 1 }) => {
  const res = await apiClient.get("/discussions", {
    params: { bookId, limit, page },
  });
  return res.data.threads;
};

// Add comment to a thread
export const addComment = async ({ threadId, content, parentId = null }) => {
  const res = await apiClient.post("/discussions/comments", {
    threadId,
    content,
    parentId,
  });
  return res.data.comment;
};

// Get comments for a thread (with pagination)
export const getComments = async ({ threadId, limit = 10, page = 1 }) => {
  const res = await apiClient.get("/discussions/comments", {
    params: { threadId, limit, page },
  });
  return res.data.comments;
};