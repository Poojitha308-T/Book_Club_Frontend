// src/features/goals/goals.api.js
import api from "@/services/apiClient";

// Get all goals
export const getUserGoals = async () => {
  const res = await api.get("/goals");
  return res.data;
};

// Create a new goal
export const addGoal = async (data) => {
  const res = await api.post("/goals", {
    targetBooks: data.targetBooks,
    targetPages: data.targetPages,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  return res.data.goal;
};

// Update completed progress
export const updateGoalProgress = async (data) => {
  const res = await api.put("/goals", data); // body includes goalId
  return res.data.goal;
};

// Delete goal (needs backend route)
export const deleteGoal = async (data) => {
  const res = await api.delete("/goals", { data }); // Axios DELETE with body
  return res.data;
};