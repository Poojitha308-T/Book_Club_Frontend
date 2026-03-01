import apiClient from "@/services/apiClient";
import axios from "axios";
// Get all suggestions
const API_URL = import.meta.env.VITE_API_BASE_URL; 
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
  const token = localStorage.getItem("token"); // get JWT from localStorage
  if (!token) throw new Error("User is not logged in");

  // console.log("Approving suggestion ID:", id, "with token:", token);

  const response = await axios.patch(
    `${API_URL}/suggestions/${id}/approve`,
    {}, // no body needed
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ pass token
      },
    }
  );
  return response.data;
}