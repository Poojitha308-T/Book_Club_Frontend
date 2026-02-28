import apiClient from "@/services/apiClient";

export const getDashboardStats = async () => {
  const response = await apiClient.get("/dashboard");
  return response.data;
};