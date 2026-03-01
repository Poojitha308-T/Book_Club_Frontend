import apiClient from "@/services/apiClient";

// Get all suggestions
export const getSuggestions = async () => {
  const res = await apiClient.get("/suggestions");
  return res.data;
};

// Create a new suggestion
export const createSuggestion = async (data) => {
  const res = await apiClient.post("/suggestions", data);
  return res.data;
};

// Vote for a suggestion
export const voteSuggestion = async (id) => {
  const res = await apiClient.post(`/suggestions/${id}/vote`);
  return res.data;
};

// Approve a suggestion (admin)
export const approveSuggestion = async (id) => {
  const res = await apiClient.put(`/suggestions/${id}/approve`);
  return res.data;
};