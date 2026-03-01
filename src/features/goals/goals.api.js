import api from "@/services/apiClient";

export const getUserGoals = async (userId) => {
  const res = await api.get("/goals", { params: { userId } });
  return res.data;
};

export const addGoal = async (data) => {
  const res = await api.post("/goals", data);
  return res.data;
};

export const updateGoalProgress = async (goalId, progress) => {
  const res = await api.patch(`/goals/${goalId}`, { progress });
  return res.data;
};