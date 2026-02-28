

import apiClient from "../path/to/apiClient"; // adjust path

export const getSuggestions = async () => {
  const res = await apiClient.get("/suggestions");
  return res.data;
};

export const createSuggestion = async (data) => {
  const res = await apiClient.post("/suggestions", data);
  return res.data;
};

export const voteSuggestion = async (id) => {
  const res = await apiClient.post(`/suggestions/${id}/vote`);
  return res.data;
};

export const approveSuggestion = async (id) => {
  const res = await apiClient.patch(`/suggestions/${id}/approve`);
  return res.data;
};