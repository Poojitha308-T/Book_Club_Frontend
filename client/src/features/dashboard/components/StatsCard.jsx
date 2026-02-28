const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-2xl flex items-center gap-4">
      {icon && <div className="text-3xl">{icon}</div>}
      <div>
        <h4 className="text-gray-500 dark:text-gray-300">{title}</h4>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
