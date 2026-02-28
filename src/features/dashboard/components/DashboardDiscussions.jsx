// src/features/dashboard/components/DashboardDiscussions.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getThreads } from "@/features/discussions/discussions.api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const DashboardDiscussions = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await getThreads();
      // Sort by latest comments or created_at
      const sorted = data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5); // show top 5
      setThreads(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch discussions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  if (loading) return <p className="text-gray-500">Loading discussions...</p>;
  if (threads.length === 0) return <p className="text-gray-500">No discussions yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Latest Discussions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/discussions/${thread.id}`)}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">{thread.title}</h4>
              <Badge variant="secondary">{thread.comments_count || 0} comments</Badge>
            </div>
            <p className="text-sm text-gray-400 mt-1">by {thread.created_by_name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardDiscussions;