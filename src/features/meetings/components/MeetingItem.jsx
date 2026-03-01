// src/features/meetings/components/MeetingItem.jsx
import { Button } from "@/components/ui/button";
import { markAttendance } from "../meetings.api";
import { toast } from "react-toastify";

const MeetingItem = ({ meeting, onAttend }) => {
  const handleAttend = async () => {
    try {
      await markAttendance(meeting.id);
      onAttend(meeting.id);
      toast.success("Attendance marked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-sm flex justify-between items-center bg-white">
      <div>
        <h3 className="font-semibold">{meeting.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(meeting.date).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          {meeting.description}
        </p>
      </div>
      {!meeting.attended && (
        <Button size="sm" variant="outline" onClick={handleAttend}>
          Attend
        </Button>
      )}
      {meeting.attended && <span className="text-green-500 font-medium">Attended</span>}
    </div>
  );
};

export default MeetingItem;