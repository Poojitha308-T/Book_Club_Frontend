// src/features/goals/pages/GoalsPage.jsx
import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import { getUserGoals } from "../goals.api"; // create API service
import { toast } from "react-toastify";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getUserGoals();
      setGoals(data.goals || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Goals</h2>
      {loading ? (
        <p className="text-gray-500">Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">No goals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsPage;