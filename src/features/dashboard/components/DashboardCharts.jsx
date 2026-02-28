import BarChart from "./../../../components/charts/BarChart";
import LineChart from "./../../../components/charts/LineChart";

const DashboardCharts = () => {
  // Example dummy data
  const barData = [
    { label: "Books", value: 120 },
    { label: "Members", value: 35 },
    { label: "Meetings", value: 5 },
    { label: "Achievements", value: 18 },
  ];

  const lineData = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 15 },
    { month: "Mar", value: 8 },
    { month: "Apr", value: 20 },
    { month: "May", value: 25 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h4 className="text-gray-500 dark:text-gray-300 mb-4 font-semibold">
          Monthly Stats
        </h4>
        <BarChart data={barData} />
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h4 className="text-gray-500 dark:text-gray-300 mb-4 font-semibold">
          Growth Over Time
        </h4>
        <LineChart data={lineData} />
      </div>
    </div>
  );
};

export default DashboardCharts;
