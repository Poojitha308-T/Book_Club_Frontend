import { useEffect, useState } from "react";
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
      try {
        setLoading(true);

        const dashboardRes = await apiClient.get("/dashboard");
        const progressRes = await apiClient.get("/progress");
        const goalsRes = await apiClient.get("/goals");

        setStats({
          totalUsers: dashboardRes.data?.data?.totalUsers || 0,
          totalBooks: dashboardRes.data?.data?.totalBooks || 0,
          progress: progressRes.data?.data || 0,
          goals: goalsRes.data?.data || 0,
        });

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Total Books", value: stats.totalBooks },
    { title: "Reading Progress", value: stats.progress },
    { title: "Active Goals", value: stats.goals },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 mt-2">
          Platform analytics summary
        </p>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
                <p className="text-slate-500 text-sm">{card.title}</p>
                <h3 className="text-4xl font-bold text-slate-800 mt-4">
                  {card.value}
                </h3>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Activity
            </h3>
            <p className="text-slate-500 text-sm">
              Activity data will appear here.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;