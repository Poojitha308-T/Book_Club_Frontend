import apiClient from "@/services/apiClient";

export const getAllUsers = async () => {
  const res = await apiClient.get("/users");
  return res.data.users || res.data;
};

export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await apiClient.put(`/users/${id}/role`, { role });
  return res.data;
};