// src/features/meetings/pages/MeetingsPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  getMeetings,
  createMeeting,
  deleteMeeting,
  markAttendance,
} from "../meetings.api";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    link: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, meetingId: null });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getMeetings();
      const parsed = res.data.map((m) => ({
        ...m,
        scheduled_at: m.scheduled_at ? new Date(m.scheduled_at) : null,
      }));

      parsed.sort((a, b) => {
        if (!a.scheduled_at) return 1;
        if (!b.scheduled_at) return -1;
        return new Date(a.scheduled_at) - new Date(b.scheduled_at);
      });

      setMeetings(parsed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.link) {
      toast.error("Please fill all required fields");
      return;
    }

    const scheduled_at = new Date(`${formData.date}T${formData.time}`).toISOString();

    try {
      const res = await createMeeting({
        title: formData.title,
        description: formData.description || null,
        scheduled_at,
        meeting_link: formData.link,
      });

      setMeetings((prev) => [
        ...prev,
        { ...res.data, scheduled_at: new Date(res.data.scheduled_at) },
      ]);
      toast.success("Meeting added successfully!");
      setFormData({ title: "", description: "", date: "", time: "", link: "" });
    } catch (err) {
      console.error("Failed to add meeting:", err);
      toast.error("Failed to add meeting");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      toast.success("Meeting deleted successfully");
      setDeleteDialog({ open: false, meetingId: null });
    } catch (err) {
      console.error("Failed to delete meeting:", err);
      toast.error("Failed to delete meeting. Please try again.");
    }
  };

  const handleAttend = async (id) => {
    try {
      await markAttendance(id);
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, attended: true } : m))
      );
      toast.success("Attendance marked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    }
  };

  if (loading)
    return <div className="p-10 animate-pulse text-center">Loading meetings...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Meetings</h1>

      {/* Add Meeting Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Meeting Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
        />
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border p-2 rounded w-full sm:w-1/2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="border p-2 rounded w-full sm:w-1/2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <input
          type="url"
          placeholder="Meeting Link (Zoom/Google Meet)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto"
        >
          Add Meeting
        </button>
      </form>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No meetings scheduled
          </p>
        )}

        {meetings.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg truncate">{m.title}</h2>
              {m.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                  {m.description}
                </p>
              )}
              {m.scheduled_at && (
                <p className="text-sm text-gray-500 mt-1">
                  {dayjs(m.scheduled_at).format("MMM DD, YYYY HH:mm")}
                </p>
              )}
              {m.meeting_link && (
                <a
                  href={m.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mt-1 block truncate"
                >
                  Join Meeting
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {!m.attended && (
                <button
                  onClick={() => handleAttend(m.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex-1 sm:flex-auto"
                >
                  Attend
                </button>
              )}
              {m.attended && (
                <span className="text-green-600 font-medium">Attended</span>
              )}

              <button
                onClick={() => setDeleteDialog({ open: true, meetingId: m.id })}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1 sm:flex-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this meeting?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setDeleteDialog({ open: false, meetingId: null })}
                className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteDialog.meetingId)}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;