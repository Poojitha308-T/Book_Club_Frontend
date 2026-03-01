// src/features/meetings/meetings.api.js
import apiClient from "@/services/apiClient";

// Fetch all meetings for the logged-in user
export const getMeetings = async () => {
  try {
    const res = await apiClient.get("/meetings");
    return res.data; // expected { success: true, data: [...] }
  } catch (err) {
    console.error("Failed to fetch meetings:", err);
    throw err;
  }
};

// Create a new meeting
export const createMeeting = async (data) => {
  try {
    const res = await apiClient.post("/meetings", data);
    return res.data; // expected { success: true, data: {...} }
  } catch (err) {
    console.error("Failed to create meeting:", err);
    throw err;
  }
};

// Delete a meeting by ID
export const deleteMeeting = async (id) => {
  try {
    const res = await apiClient.delete(`/meetings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete meeting:", err);
    throw err;
  }
};

// Mark attendance for a meeting
export const markAttendance = async (id) => {
  try {
    const res = await apiClient.post(`/meetings/${id}/attend`);
    return res.data; // expected { success: true, message: "Attendance marked" }
  } catch (err) {
    console.error("Failed to mark attendance:", err);
    throw err;
  }
};