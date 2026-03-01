import apiClient from "@/services/apiClient";

// Get all notifications for current user
export const getNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return res.data.notifications; // expecting { notifications: [...] }
};

// Mark a notification as read
export const markNotificationRead = async (notificationId) => {
  const res = await apiClient.put(`/notifications/${notificationId}/read`);
  return res.data;
};