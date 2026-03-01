// src/components/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ progress = 0, max = 100, height = 10, color = "bg-indigo-600" }) => {
  const percentage = Math.min((progress / max) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full" style={{ height }}>
      <div
        className={`${color} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%`, height }}
      ></div>
    </div>
  );
};

export default ProgressBar;