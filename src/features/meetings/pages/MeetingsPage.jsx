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
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    meetingId: null,
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getMeetings();
      const meetingsData = res.data || [];

      const parsed = meetingsData.map((m) => ({
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

    const scheduled_at = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    try {
      const res = await createMeeting({
        title: formData.title,
        description: formData.description || null,
        scheduled_at,
        meeting_link: formData.link,
      });

      const newMeeting = res.data?.data || res.data;

      setMeetings((prev) => [
        ...prev,
        {
          ...newMeeting,
          scheduled_at: new Date(newMeeting.scheduled_at),
        },
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
      toast.error("Failed to delete meeting");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-base sm:text-lg text-gray-500">
        Loading meetings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-950 dark:to-slate-900 px-3 sm:px-6 py-6">
      
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          📅 Meetings
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-4 sm:p-6 space-y-4 border dark:border-slate-800"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            Create Meeting
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2.5 sm:p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
          />

          {/* DATE + TIME */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full sm:flex-1 p-2.5 sm:p-3 rounded-lg border text-sm sm:text-base"
            />

            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full sm:flex-1 p-2.5 sm:p-3 rounded-lg border text-sm sm:text-base"
            />
          </div>

          <input
            type="url"
            placeholder="Meeting Link"
            value={formData.link}
            onChange={(e) =>
              setFormData({ ...formData, link: e.target.value })
            }
            className="w-full p-2.5 sm:p-3 rounded-lg border text-sm sm:text-base"
          />

          <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition text-sm sm:text-base">
            ➕ Add Meeting
          </button>
        </form>

        {/* MEETINGS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {meetings.length === 0 && (
            <p className="text-gray-500 col-span-full text-center text-sm sm:text-base">
              No meetings available
            </p>
          )}

          {meetings.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white break-words">
                  {m.title}
                </h2>

                {m.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                    {m.description}
                  </p>
                )}

                {m.scheduled_at && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    🕒 {dayjs(m.scheduled_at).format("MMM DD, YYYY HH:mm")}
                  </p>
                )}

                {m.meeting_link && (
                  <a
                    href={m.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-xs sm:text-sm mt-2 inline-block hover:underline break-all"
                  >
                    🔗 Join Meeting
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {!m.attended ? (
                  <button
                    onClick={() => handleAttend(m.id)}
                    className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm"
                  >
                    Attend
                  </button>
                ) : (
                  <span className="text-green-600 font-medium text-sm">
                    ✔ Attended
                  </span>
                )}

                <button
                  onClick={() =>
                    setDeleteDialog({ open: true, meetingId: m.id })
                  }
                  className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE MODAL */}
        {deleteDialog.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
              <p className="mb-4 text-sm sm:text-base">
                Delete this meeting?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    setDeleteDialog({ open: false, meetingId: null })
                  }
                  className="px-4 py-2 border rounded text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteDialog.meetingId)}
                  className="px-4 py-2 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;