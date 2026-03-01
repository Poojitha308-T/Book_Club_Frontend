import { useEffect, useState } from "react";
import { getMeetings, createMeeting } from "../meetings.api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", date: "" });

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date) {
      toast.error("Title and Date are required");
      return;
    }
    try {
      const res = await createMeeting(newMeeting);
      toast.success("Meeting created");
      setNewMeeting({ title: "", date: "" });
      setModalOpen(false);
      fetchMeetings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create meeting");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meetings</h2>
        <Button onClick={() => setModalOpen(true)}>New Meeting</Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="text-gray-500">No meetings scheduled</p>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{m.title}</p>
                <p className="text-gray-400 text-sm">{new Date(m.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating meeting */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">New Meeting</h3>
            <Input
              placeholder="Title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateMeeting}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;