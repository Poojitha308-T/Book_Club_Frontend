import { useEffect, useState } from "react";
import { getUserProgress } from "../progress.api";
import { toast } from "react-toastify";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const data = await getUserProgress(localStorage.getItem("userId"));
      setProgressData(data || []);
    } catch {
      toast.error("Failed to fetch progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      {loading ? (
        <p className="text-gray-500">Loading progress...</p>
      ) : progressData.length === 0 ? (
        <p className="text-gray-500">No progress data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="booksRead" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressPage;