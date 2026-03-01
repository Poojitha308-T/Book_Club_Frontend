import api from "@/services/apiClient";

export const getUserProgress = async (userId, period = "monthly") => {
  const res = await api.get("/progress", { params: { userId, period } });
  return res.data;
};