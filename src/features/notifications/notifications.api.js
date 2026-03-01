import apiClient from "@/services/apiClient";

export const getNotifications = async () => {
  // First get logged-in user
  const meRes = await apiClient.get("/users/me");
  const userId = meRes.data.user.id;

  // Then fetch notifications using correct userId
  const res = await apiClient.get(`/notifications/user/${userId}`);

  return res.data.data;
};

export const markNotificationRead = async (notificationId) => {
  const res = await apiClient.patch(
    `/notifications/${notificationId}/read`
  );
  return res.data;
};