// src/features/dashboard/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    progress: 0,
    goals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all stats in parallel
        const [dashboardRes, progressRes, goalsRes] = await Promise.all([
          apiClient.get("/dashboard"),
          apiClient.get("/progress"),
          apiClient.get("/goals"),
        ]);

        setStats({
          totalUsers: dashboardRes.data?.data?.totalUsers || 0,
          totalBooks: dashboardRes.data?.data?.totalBooks || 0,
          progress: progressRes.data?.data || 0,
          goals: goalsRes.data?.data || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, color: "bg-indigo-600" },
    { title: "Total Books", value: stats.totalBooks, color: "bg-green-500" },
    { title: "Reading Progress", value: stats.progress, color: "bg-yellow-500" },
    { title: "Active Goals", value: stats.goals, color: "bg-purple-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Platform analytics summary</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))
          : cards.map((card, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow-md border p-6 flex flex-col justify-between hover:shadow-lg transition`}
              >
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-4xl font-bold mt-4 text-gray-800">{card.value}</h3>
              </div>
            ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Activity data will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;