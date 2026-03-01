// src/features/dashboard/components/GoalsSummary.jsx
import ProgressBar from "@/components/ProgressBar";

const GoalsSummary = ({ goals }) => {
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md space-y-2">
      <h3 className="font-semibold text-lg">Overall Progress</h3>
      <p className="text-gray-500 text-sm">
        {totalCurrent}/{totalTarget} completed
      </p>
      <ProgressBar progress={totalCurrent} max={totalTarget} />
    </div>
  );
};

export default GoalsSummary;