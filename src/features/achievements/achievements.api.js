
import api from "@/services/apiClient";

// Fetch all achievements for the user
export const getAchievements = async () => {
  const res = await api.get("/achievements");
  return res.data;
};

// Add a new achievement (admin or user)
export const addAchievement = async (achievementData) => {
  const res = await api.post("/achievements", achievementData);
  return res.data;
};