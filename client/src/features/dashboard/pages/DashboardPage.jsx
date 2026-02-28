import { useEffect, useState } from "react";
import { getDashboardStats, getThreads } from "../dashboard.api";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../../../components/ui/card";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalReviews: 0,
    totalDiscussions: 0,
  });

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        const threadsRes = await getThreads();

        setStats({
          totalUsers: statsRes?.data?.totalUsers ?? 0,
          totalBooks: statsRes?.data?.totalBooks ?? 0,
          totalReviews: statsRes?.data?.totalReviews ?? 0,
          totalDiscussions: statsRes?.data?.totalDiscussions ?? 0,
        });

        setThreads(threadsRes?.threads ?? []);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = threads.map((t) => ({
    name: t.title?.slice(0, 12) || "Thread",
    comments: Number(t.comment_count) || 0,
  }));

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <main className="px-6 py-10 space-y-10 max-w-7xl mx-auto">
        
        {/* PLATFORM OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Platform Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Total Books" value={stats.totalBooks} />
            <StatCard title="Total Reviews" value={stats.totalReviews} />
            <StatCard title="Total Discussions" value={stats.totalDiscussions} />
          </div>
        </section>

        {/* REVIEWS SUMMARY */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Reviews Summary
          </h2>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <p className="text-slate-600 font-medium">
                Total Reviews Submitted
              </p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {stats.totalReviews}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* DISCUSSION ACTIVITY CHART */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Discussion Activity
          </h2>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 h-96">
              {threads.length === 0 ? (
                <p className="text-slate-400 text-center">
                  No discussions yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="comments"
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
    <CardContent className="p-6">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h2 className="text-3xl font-bold text-slate-800 mt-2">{value}</h2>
    </CardContent>
  </Card>
);

export default DashboardPage;