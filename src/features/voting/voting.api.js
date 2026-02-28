// src/features/voting/voting.api.js
import apiClient from "../../services/apiClient";

// Get all suggested books with vote counts
export const fetchVotingBooks = async () => {
  const response = await apiClient.get("/votes");
  return response.data;
};

// Submit a vote for a book
export const voteBook = async (bookId) => {
  const response = await apiClient.post("/votes", { book_id: bookId });
  return response.data;
};