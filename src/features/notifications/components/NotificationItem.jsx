// src/features/notifications/NotificationItem.jsx
import { useState } from "react";
import { markNotificationRead } from "./notifications.api";

const NotificationItem = ({ notification, onUpdate }) => {
  const [read, setRead] = useState(notification.read);

  const handleClick = async () => {
    if (!read) {
      await markNotificationRead(notification.id);
      setRead(true);
      onUpdate();
    }
    // Optional: navigate to related page if notification has a link
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-100 ${
        read ? "bg-white" : "bg-indigo-50 border-indigo-200"
      }`}
      onClick={handleClick}
    >
      <p className="text-sm">{notification.message}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(notification.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default NotificationItem;