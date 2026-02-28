// dashboard.api.js
import apiClient from "../../services/apiClient";

// Get dashboard stats
export const getDashboardStats = async () => {
  const res = await apiClient.get("/dashboard");
  return res.data; // IMPORTANT: return directly
};

// Get discussion threads
export const getThreads = async () => {
  const res = await apiClient.get("/discussions");
  return res.data;
};

// Get suggested books with votes
export const fetchVotingBooks = async () => {
  const res = await apiClient.get("/suggestions");
  return res.data;
};

// Approve suggestion
export const approveSuggestion = async (id) => {
  const res = await apiClient.patch(`/suggestions/${id}/approve`);
  return res.data;
};