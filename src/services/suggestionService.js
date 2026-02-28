// src/services/suggestionService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSuggestions = async () => {
  const res = await API.get("/suggestions");
  return res.data; // <-- directly return array
};

export const createSuggestion = async (data) => {
  const res = await API.post("/suggestions", data);
  return res.data;
};

export const voteSuggestion = async (id) => {
  const res = await API.post(`/suggestions/${id}/vote`);
  return res.data;
};

export const approveSuggestion = async (id) => {
  const res = await API.patch(`/suggestions/${id}/approve`);
  return res.data;
};