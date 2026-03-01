import apiClient from "@/services/apiClient";
import axios from "axios";

export const registerUser = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    data
  );
  return response.data;
};