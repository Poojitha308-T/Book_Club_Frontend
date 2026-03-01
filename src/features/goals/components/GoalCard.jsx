// src/features/goals/components/GoalCard.jsx
import React from "react";
import ProgressBar from "@/components/ProgressBar";

const GoalCard = ({ goal }) => {
  const { title, current, target } = goal;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">
        {current}/{target} completed
      </p>
      <ProgressBar progress={current} max={target} />
    </div>
  );
};

export default GoalCard;