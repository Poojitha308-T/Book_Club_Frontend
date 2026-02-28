import { useEffect, useState } from "react";
import { getDashboardStats } from "../dashboard.api";
import { getThreads } from "@/features/discussions/discussions.api";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const dashboardRes = await getDashboardStats();
        const threadsRes = await getThreads();

        setStats(dashboardRes?.data || {});
        setThreads(threadsRes?.threads || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading)
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;

  const recentThreads = [...threads]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const mostActiveThread =
    threads.length > 0
      ? threads.reduce((prev, current) =>
          Number(prev.comment_count) > Number(current.comment_count)
            ? prev
            : current
        )
      : null;

  const chartData = threads.map((t) => ({
    name: t.title.length > 10 ? t.title.slice(0, 10) + "..." : t.title,
    comments: Number(t.comment_count),
  }));

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Users" value={stats.totalUsers} />
        <StatCard title="Books" value={stats.totalBooks} />
        <StatCard title="Reviews" value={stats.totalReviews} />
        <StatCard title="Discussions" value={stats.totalDiscussions} />
      </div>

      {/* ===== MOST ACTIVE THREAD ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Most Active Discussion
        </h2>

        <Card>
          <CardContent className="p-6">
            {mostActiveThread ? (
              <>
                <h3 className="text-lg font-bold">
                  {mostActiveThread.title}
                </h3>
                <p className="text-gray-500 mt-2">
                  {mostActiveThread.comment_count} comments
                </p>
              </>
            ) : (
              <p className="text-gray-400">
                No discussions available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== RECENT DISCUSSIONS ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recent Discussions
        </h2>

        <div className="space-y-4">
          {recentThreads.length === 0 ? (
            <p className="text-gray-400">
              No recent discussions
            </p>
          ) : (
            recentThreads.map((thread) => (
              <Card key={thread.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">
                    {thread.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {thread.comment_count} comments
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* ===== ANALYTICS CHART ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Discussion Activity
        </h2>

        <Card>
          <CardContent className="p-6 h-80">
            {chartData.length === 0 ? (
              <p className="text-gray-400">
                No data to display
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="comments" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card className="shadow-sm hover:shadow-md transition">
    <CardContent className="p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">
        {value || 0}
      </h2>
    </CardContent>
  </Card>
);

export default DashboardPage;