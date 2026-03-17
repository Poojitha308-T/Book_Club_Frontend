import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import AddGoalForm from "../components/AddGoalForm";
import GoalsSummary from "../../dashboard/components/GoalsSummary";
import { getUserGoals } from "../goals.api";
import { toast } from "react-toastify";
import {
  Target,
  LayoutGrid,
  Plus,
  Loader2,
  Trophy,
  Sparkles,
} from "lucide-react";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleGoalAdded = (newGoal) => setGoals((prev) => [...prev, newGoal]);

  const handleGoalUpdated = (updatedGoal) =>
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );

  const handleGoalDeleted = (goalId) =>
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Growth Engine
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <Target className="text-indigo-600 dark:text-indigo-400" size={32} />
              Reading Goals
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-xl">
              Define your journey, track your pace, and celebrate every finished chapter.
            </p>
          </div>

          {/* STATS */}
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl">
              <Trophy className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Active Goals
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {goals.length}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* ADD GOAL */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Plus className="text-indigo-500" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  New Objective
                </h3>
              </div>

              <div className="bg-transparent dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800">
                <AddGoalForm onGoalAdded={handleGoalAdded} />
              </div>
            </section>

            {/* SUMMARY */}
            {goals.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-amber-500" size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Insights
                  </h3>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <GoalsSummary goals={goals} />
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-7">
            
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="text-indigo-500" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Timeline
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Loader2 className="animate-spin text-indigo-600 mb-3" size={30} />
                <p className="text-sm text-slate-500">Loading goals...</p>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Target className="mx-auto text-slate-400 mb-4" size={36} />
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Your path is open
                </h4>
                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                  You haven't committed to any reading goals yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5 pb-10">
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
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;