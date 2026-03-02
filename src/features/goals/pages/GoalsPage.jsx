
import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import AddGoalForm from "../components/AddGoalForm";
import GoalsSummary from "../../dashboard/components/GoalsSummary";
import { getUserGoals } from "../goals.api";
import { toast } from "react-toastify";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch goals from backend
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getUserGoals();
      setGoals(data.goals || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handlers for CRUD operations
  const handleGoalAdded = (newGoal) => setGoals((prev) => [...prev, newGoal]);
  const handleGoalUpdated = (updatedGoal) =>
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  const handleGoalDeleted = (goalId) =>
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Goals</h2>

      {/* Add New Goal Form */}
      <AddGoalForm onGoalAdded={handleGoalAdded} />

      {/* Show overall progress summary if goals exist */}
      {goals.length > 0 && <GoalsSummary goals={goals} />}

      {/* Goals list */}
      {loading ? (
        <p className="text-gray-500">Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">No goals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onGoalUpdated={handleGoalUpdated}
              onGoalDeleted={handleGoalDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsPage;