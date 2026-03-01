import { useEffect, useState } from "react";
import { getAchievements } from "../achievements.api";
import AchievementCard from "../components/AchievementCard";
import { toast } from "react-toastify";

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements(localStorage.getItem("userId"));
      setAchievements(data || []);
    } catch (err) {
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Achievements</h2>
      {loading ? (
        <p className="text-gray-500">Loading achievements...</p>
      ) : achievements.length === 0 ? (
        <p className="text-gray-500">No achievements yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;