import api from "@/services/apiClient";


export const getUserAchievements = async (userId) => {
  const url = userId ? `/achievements/${userId}` : "/achievements/me";
  const res = await api.get(url);
  return res.data.data; // ✅ FIX HERE
};

export const getAllAchievements = async () => {
  const res = await api.get("/achievements");
  return res.data.data; // ✅ FIX HERE
};

export const assignAchievementToUser = async (userId, achievementId) => {
  const res = await api.post("/achievements/create", {
    userId,
    achievementId,
  });
  return res.data;
};

export const removeUserAchievement = async (userId, achievementId) => {
  const res = await api.delete("/achievements/remove", {
    data: { userId, achievementId },
  });
  return res.data;
};