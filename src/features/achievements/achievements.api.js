import api from "@/services/apiClient";

// Fetch user achievements
export const getUserAchievements = async (userId) => {
  const res = await api.get("/achievements", { params: { userId } });
  return res.data;
};