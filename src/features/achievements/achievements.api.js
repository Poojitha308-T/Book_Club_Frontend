// src/features/achievements/achievements.api.js
import api from "@/services/apiClient";

// Get achievements earned by a user
// If no userId is provided, it fetches the logged-in user's achievements
export const getUserAchievements = async (userId) => {
  const url = userId ? `/achievements/${userId}` : "/achievements/me";
  const res = await api.get(url);
  return res.data;
};

// Admin: assign achievement to a user
export const assignAchievementToUser = async (userId, achievementId) => {
  // Ensure API receives numbers
  const res = await api.post("/achievements/create", {
    userId: Number(userId),
    achievementId: Number(achievementId),
  });
  return res.data;
};

// Get all achievements in the system
export const getAllAchievements = async () => {
  const res = await api.get("/achievements");
  return res.data;
};
