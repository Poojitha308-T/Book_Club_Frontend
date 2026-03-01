import apiClient from "@/services/apiClient";

// Fetch all meetings for user
export const getMeetings = async () => {
  const res = await apiClient.get("/meetings");
  return res.data.meetings;
};

// Create new meeting
export const createMeeting = async (data) => {
  const res = await apiClient.post("/meetings", data);
  return res.data;
};