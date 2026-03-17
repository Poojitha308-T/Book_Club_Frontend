// src/features/achievements/pages/AchievementsPage.jsx
import { useEffect, useState } from "react";
import {
  getUserAchievements,
  assignAchievementToUser,
  getAllAchievements,
  removeUserAchievement, // ✅ added
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

      const role = localStorage.getItem("role");
      const userId = parseInt(localStorage.getItem("userId"), 10);
      const isAdminUser = role === "admin";
      setIsAdmin(isAdminUser);

      console.log("Role:", role);
      console.log("UserId:", userId);
      console.log("IsAdmin:", isAdminUser);

      const earnedRes = await getUserAchievements();
      setEarnedAchievements(earnedRes || []);

      const allRes = await getAllAchievements();
      setAllAchievements(allRes || []);

      const usersRes = await getAllUsers();
      console.log("Full users response:", usersRes);

      let users = [];
      if (Array.isArray(usersRes)) {
        users = usersRes;
      } else if (usersRes.data) {
        users = Array.isArray(usersRes.data)
          ? usersRes.data
          : [usersRes.data];
      } else if (usersRes.users) {
        users = Array.isArray(usersRes.users)
          ? usersRes.users
          : [usersRes.users];
      }

      if (isAdminUser) {
        setAllUsers(users);
      } else {
        const currentUser = users.find((u) => {
          return String(u.id) === String(userId) || u.id === userId;
        });

        setAllUsers(currentUser ? [currentUser] : users);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
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
        const res = await getUserAchievements(); // backend only supports /me
        setSelectedUserEarned(res || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserAchievements();
  }, [selectedUserId]);

  const handleAssignAchievement = async () => {
    console.log("Selected User:", selectedUserId);
    console.log("Selected Achievement:", selectedAchievement);

    if (!selectedAchievement || selectedAchievement === "0") {
      return toast.error("Select an achievement");
    }

    if (!selectedUserId || selectedUserId === "0") {
      return toast.error("Select a user");
    }

    try {
      await assignAchievementToUser(selectedUserId, selectedAchievement);

      toast.success("Achievement assigned successfully!");

      const updatedAchievements = await getUserAchievements();
      setEarnedAchievements(updatedAchievements || []);

      setSelectedAchievement("");
      setSelectedUserId("");
      setSelectedUserEarned([]);
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "Failed to assign achievement"
      );
    }
  };

  // ✅ DELETE FUNCTION
  const handleRemove = async (achievementId) => {
    if (!selectedUserId) {
      return toast.error("Select a user first");
    }

    try {
      await removeUserAchievement(selectedUserId, achievementId);

      toast.success("Achievement removed");

      const updated = await getUserAchievements();
      setEarnedAchievements(updated || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove");
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
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800 dark:text-slate-200">
      <h2 className="text-3xl font-bold tracking-tight">Achievements</h2>

      <section
        className="bg-white dark:bg-slate-900 
        border border-slate-200 dark:border-slate-800 
        p-6 rounded-2xl shadow-sm space-y-4 transition-all"
      >
        <h3 className="text-lg font-semibold">Assign Achievement</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="flex-1 px-3 py-2 rounded-lg border 
            bg-white dark:bg-slate-800 
            border-slate-300 dark:border-slate-700 
            focus:ring-2 focus:ring-indigo-500 outline-none"
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
                {ach.name}{" "}
                {earnedIds.includes(ach.id) ? "(Already earned)" : ""}
              </option>
            ))}
          </select>

          <select
            className="flex-1 px-3 py-2 rounded-lg border 
            bg-white dark:bg-slate-800 
            border-slate-300 dark:border-slate-700 
            focus:ring-2 focus:ring-indigo-500 outline-none"
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
            className="px-5 py-2.5 rounded-lg 
            bg-indigo-600 text-white font-medium
            hover:bg-indigo-700 active:scale-95 
            transition-all shadow-sm"
          >
            Assign
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {earnedAchievements.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            No achievements earned yet
          </p>
        ) : (
          earnedAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-slate-800 
              p-5 rounded-2xl shadow-sm 
              hover:shadow-md hover:-translate-y-1 
              transition-all duration-300 text-center"
            >
              <h3 className="font-semibold text-lg">{ach.name}</h3>

              <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                {ach.description}
              </p>

              {ach.earned_at && (
                <p className="text-xs mt-3 text-slate-400 dark:text-slate-500">
                  Earned on{" "}
                  {new Date(ach.earned_at).toLocaleDateString()}
                </p>
              )}

              {/* ✅ REMOVE BUTTON */}
              <button
                onClick={() => handleRemove(ach.id)}
                className="mt-3 text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AchievementsPage;