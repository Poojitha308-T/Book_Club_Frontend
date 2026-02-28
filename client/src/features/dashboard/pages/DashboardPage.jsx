import { useEffect, useState } from "react";
import { getDashboardStats, getThreads } from "../dashboard.api";
import { getUserLibrary, addBookToLibrary } from "@/features/library/library.api";
import { getAllBooks } from "@/features/books/books.api";
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

  const [libraryStats, setLibraryStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    to_read: 0,
  });

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("to_read");

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch all dashboard data
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

        // 🔥 Fetch Books for dropdown
        try {
          const booksRes = await getAllBooks();
          setBooks(booksRes?.books ?? []);
        } catch (err) {
          console.error("Failed to fetch books", err);
        }

        // 🔥 Fetch Library Stats
        await refreshLibraryStats();

      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 Helper: refresh library stats
  const refreshLibraryStats = async () => {
    try {
      const libraryRes = await getUserLibrary();
      const libraryData = libraryRes?.library ?? [];

      setLibraryStats({
        total: libraryData.length,
        reading: libraryData.filter((b) => b.status === "reading").length,
        completed: libraryData.filter((b) => b.status === "completed").length,
        to_read: libraryData.filter((b) => b.status === "to_read").length,
      });
    } catch (err) {
      console.error("Library fetch failed:", err);
    }
  };

  // 🔥 ADD BOOK HANDLER
  const handleAddToLibrary = async () => {
    if (!selectedBook) {
      toast.error("Please select a book");
      return;
    }

    try {
      const response = await addBookToLibrary(selectedBook, selectedStatus);

      if (response.success) {
        toast.success("Book added to library");
        await refreshLibraryStats(); // 🔥 refresh stats instantly
        setSelectedBook("");
        setSelectedStatus("to_read");
      } else {
        toast.error(response.message || "Failed to add book");
      }

    } catch (error) {
      toast.error("Failed to add book");
      console.error(error);
    }
  };

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

        {/* ADD BOOK TO LIBRARY */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Add Book To Library
          </h2>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">

              <select
                className="w-full border p-2 rounded"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="">Select Book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>

              <select
                className="w-full border p-2 rounded"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="to_read">To Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={handleAddToLibrary}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add To Library
              </button>

            </CardContent>
          </Card>
        </section>

        {/* MY LIBRARY OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            My Library Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total in Library" value={libraryStats.total} />
            <StatCard title="Reading" value={libraryStats.reading} />
            <StatCard title="Completed" value={libraryStats.completed} />
            <StatCard title="Wishlist" value={libraryStats.to_read} />
          </div>
        </section>

        {/* DISCUSSION ACTIVITY */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Discussion Activity
          </h2>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 h-96">
              {threads.length === 0 ? (
                <p className="text-slate-400 text-center">No discussions yet</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="comments" fill="#4f46e5" radius={[6, 6, 0, 0]} />
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