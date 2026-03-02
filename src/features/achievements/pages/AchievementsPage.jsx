// src/features/achievements/pages/AchievementsPage.jsx
import { useEffect, useState } from "react";
import {
  getUserAchievements,
  assignAchievementToUser,
  getAllAchievements,
} from "../achievements.api";
import { getAllUsers } from "@/features/users/users.api";
import { toast } from "react-toastify";

const AchievementsPage = () => {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUserEarned, setSelectedUserEarned] = useState([]);

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true);

      const role = localStorage.getItem("role"); // "admin" or "user"
      const userId = parseInt(localStorage.getItem("userId"), 10);
      const isAdminUser = role === "admin";
      setIsAdmin(isAdminUser);

      console.log("Role:", role);
      console.log("UserId:", userId);
      console.log("IsAdmin:", isAdminUser);

      // Get current user's achievements (for display)
      const earnedRes = await getUserAchievements();
      setEarnedAchievements(earnedRes.data || []);

      // Get all achievements
      const allRes = await getAllAchievements();
      setAllAchievements(allRes.data || []);

      // Get all users - FIX: Handle different response structures
      const usersRes = await getAllUsers();
      console.log("Full users response:", usersRes);
      console.log("Users response keys:", Object.keys(usersRes));
      
      // Handle different API response structures
      let users = [];
      if (Array.isArray(usersRes)) {
        users = usersRes;
      } else if (usersRes.data) {
        users = Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data];
      } else if (usersRes.users) {
        users = Array.isArray(usersRes.users) ? usersRes.users : [usersRes.users];
      }
      
      console.log("Processed users array:", users);
      console.log("First user structure (if any):", users[0] ? JSON.stringify(users[0]) : "no users");

      if (isAdminUser) {
        setAllUsers(users);
      } else {
        // For non-admin, find current user
        console.log("Looking for user with id:", userId, "type:", typeof userId);
        
        const currentUser = users.find((u) => {
          console.log("Comparing user id:", u.id, "type:", typeof u.id, "with:", userId);
          return String(u.id) === String(userId) || u.id === userId;
        });
        
        console.log("Current user found:", currentUser);
        setAllUsers(currentUser ? [currentUser] : users); // Fallback to all users if not found
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error response:", err.response?.data);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch achievements for selected user to prevent duplicates
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUserEarned([]);
      return;
    }

    const fetchUserAchievements = async () => {
      try {
        const res = await getUserAchievements(selectedUserId);
        setSelectedUserEarned(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserAchievements();
  }, [selectedUserId]);

  const handleAssignAchievement = async () => {
  if (!selectedAchievement) return toast.error("Select an achievement");
  if (!selectedUserId) return toast.error("Select a user");

  try {
    // Convert IDs to numbers
    const userIdNum = parseInt(selectedUserId, 10);
    const achievementIdNum = parseInt(selectedAchievement, 10);

    await assignAchievementToUser(userIdNum, achievementIdNum);
    toast.success("Achievement assigned successfully!");

    // Refetch achievements for the selected user
    const updatedAchievements = await getUserAchievements(userIdNum);
    setEarnedAchievements(updatedAchievements || []);

    setSelectedAchievement("");
    setSelectedUserId("");
    setSelectedUserEarned([]);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to assign achievement");
  }
};
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading achievements...
      </div>
    );

  const earnedIds = selectedUserEarned.map((ach) => ach.id);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Achievements</h2>

      {/* Debug info - remove after testing */}
      <div className="bg-yellow-100 p-2 text-sm">
        Debug: Role: {localStorage.getItem("role")} | Users loaded: {allUsers.length}
      </div>

      {/* Assign Achievement Section */}
      <section className="bg-white p-4 rounded-2xl shadow-md space-y-4">
        <h3 className="text-lg font-semibold">Assign Achievement</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Achievement dropdown */}
          <select
            className="border p-2 rounded flex-1"
            value={selectedAchievement}
            onChange={(e) => setSelectedAchievement(e.target.value)}
          >
            <option value="">Select Achievement</option>
            {allAchievements.map((ach) => (
              <option
                key={ach.id}
                value={ach.id}
                disabled={earnedIds.includes(ach.id)}
              >
                {ach.name} {earnedIds.includes(ach.id) ? "(Already earned)" : ""}
              </option>
            ))}
          </select>

          {/* User dropdown */}
          <select
            className="border p-2 rounded flex-1"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignAchievement}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Assign Achievement
          </button>
        </div>
      </section>

      {/* Earned Achievements */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {earnedAchievements.length === 0 ? (
          <p className="text-gray-500">No achievements earned yet</p>
        ) : (
          earnedAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white p-4 rounded-2xl shadow-md text-center"
            >
              <h3 className="font-semibold">{ach.name}</h3>
              <p className="text-gray-500 text-sm">{ach.description}</p>
              {ach.earned_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Earned on: {new Date(ach.earned_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AchievementsPage;