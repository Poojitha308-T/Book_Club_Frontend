import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../notifications.api";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading notifications...</p>;

  if (!notifications.length)
    return <p className="p-6 text-gray-500">No notifications</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Notifications</h2>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded-lg shadow-sm flex justify-between items-center ${
            n.read ? "bg-gray-50" : "bg-indigo-50"
          }`}
        >
          <div>
            <p className="text-gray-800">{n.message}</p>
            <p className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</p>
          </div>
          {!n.read && (
            <button
              onClick={() => handleMarkRead(n.id)}
              className="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;