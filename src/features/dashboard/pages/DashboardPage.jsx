import { useEffect, useState } from "react";
import { getDashboardStats } from "../dashboard.api";
import {
  getUserLibrary,
  addBookToLibrary,
} from "@/features/library/library.api";
import { getAllBooks } from "@/features/books/books.api";
import { getBookReviews, addBookReview } from "@/features/reviews/reviews.api";
import { getUserGoals } from "@/features/goals/goals.api";
import { getAchievements } from "@/features/achievements/achievements.api";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

// ⭐ Star rating component
const StarRating = ({ rating = 0, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars)
        .fill(0)
        .map((_, idx) => (
          <span key={`full-${idx}`} className="text-yellow-400 text-lg">
            ★
          </span>
        ))}
      {halfStar && <span className="text-yellow-400 text-lg">⯨</span>}
      {Array(emptyStars)
        .fill(0)
        .map((_, idx) => (
          <span key={`empty-${idx}`} className="text-gray-300 text-lg">
            ★
          </span>
        ))}
    </div>
  );
};

// ⭐ ProgressBar component
const ProgressBar = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div
      className="bg-indigo-600 h-3 rounded-full transition-all"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [libraryStats, setLibraryStats] = useState({});
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("to_read");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        const booksRes = await getAllBooks();
        const goalsRes = await getUserGoals();
        const achievementsRes = await getAchievements();

        setStats({
          totalUsers: statsRes?.data?.totalUsers ?? 0,
          totalBooks: statsRes?.data?.totalBooks ?? 0,
          totalReviews: statsRes?.data?.totalReviews ?? 0,
          totalDiscussions: statsRes?.data?.totalDiscussions ?? 0,
          totalNotifications: statsRes?.data?.totalNotifications ?? 0,
          totalMeetings: statsRes?.data?.totalMeetings ?? 0,
          upcomingMeetings: statsRes?.data?.upcomingMeetings ?? [],
        });

        setBooks(booksRes?.books ?? []);
        setGoals(goalsRes?.goals ?? []);
        setAchievements(achievementsRes?.achievements ?? []);

        await fetchLibraryWithTitlesAndRatings(booksRes?.books ?? []);
      } catch (err) {
        toast.error("Failed to load dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLibraryWithTitlesAndRatings = async (allBooks) => {
    try {
      const libraryRes = await getUserLibrary();
      const libBooks = libraryRes?.library ?? [];

      const libWithTitles = await Promise.all(
        libBooks.map(async (b) => {
          const bookInfo = allBooks.find((book) => book.id === b.book_id);
          let avgRating = null;
          try {
            const revRes = await getBookReviews(b.book_id);
            const bookReviews = revRes.reviews ?? [];
            avgRating = bookReviews.length
              ? bookReviews.reduce((sum, r) => sum + r.rating, 0) /
                bookReviews.length
              : null;
          } catch {}
          return { ...b, title: bookInfo?.title || "Unknown", avgRating };
        }),
      );

      setLibrary(libWithTitles);
      setLibraryStats({
        total: libWithTitles.length,
        reading: libWithTitles.filter((b) => b.status === "reading").length,
        completed: libWithTitles.filter((b) => b.status === "completed").length,
        to_read: libWithTitles.filter((b) => b.status === "to_read").length,
      });
    } catch (err) {
      console.error(err);
      setLibraryStats({ total: 0, reading: 0, completed: 0, to_read: 0 });
    }
  };

  const handleAddToLibrary = async () => {
    if (!selectedBook) return toast.error("Please select a book");
    try {
      const res = await addBookToLibrary(selectedBook, selectedStatus);
      if (res.success) {
        toast.success("Book added to library");
        setSelectedBook("");
        setSelectedStatus("to_read");
        await fetchLibraryWithTitlesAndRatings(books);
      }
    } catch {
      toast.error("Failed to add book");
    }
  };

 // --- fetch reviews for a selected book ---
const fetchReviewsForBook = async (bookId) => {
  if (!bookId) return setReviews([]);

  try {
    const reviewsData = await getBookReviews(bookId); 
    // getBookReviews should return an array directly
    setReviews(reviewsData ?? []);
  } catch (err) {
    console.error("Fetch reviews failed:", err.response?.data || err.message);
    setReviews([]);
    toast.error("Failed to fetch reviews for this book");
  }
};

// --- handle adding a review ---
const handleAddReview = async () => {
  if (!selectedBook) {
    toast.error("Please select a book first");
    return;
  }
  if (!reviewText.trim()) {
    toast.error("Write a review before submitting");
    return;
  }

  try {
    // Send review to backend
    await addBookReview(selectedBook, reviewRating, reviewText);

    toast.success("Review added successfully!");

    // ✅ Reset the review input and rating
    setReviewText("");        // clear textarea
    setReviewRating(5);       // reset rating to default 5 stars

    // Refresh the reviews list
    fetchReviewsForBook(selectedBook);

    // Optional: update library avgRating immediately
    const updatedLibrary = library.map((b) =>
      b.book_id === selectedBook
        ? {
            ...b,
            avgRating: reviews.length
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) + reviewRating) /
                (reviews.length + 1)
              : reviewRating,
          }
        : b
    );
    setLibrary(updatedLibrary);
  } catch (err) {
    console.error("Add review failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to add review");
  }
};
  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors">
    <main className="px-4 sm:px-6 lg:px-10 py-10 space-y-14 max-w-7xl mx-auto">

      {/* PLATFORM OVERVIEW */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 tracking-tight">
          Platform Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Total Books" value={stats.totalBooks} />
          <StatCard title="Total Reviews" value={stats.totalReviews} />
          <StatCard title="Total Discussions" value={stats.totalDiscussions} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          <StatCard title="Notifications" value={stats.totalNotifications} />
          <StatCard
            title="Upcoming Meetings"
            value={stats.upcomingMeetings?.length ?? 0}
          />
        </div>
      </section>

        {/* ADD BOOK */}
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
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
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

        {/* LIBRARY OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            My Library Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Books" value={libraryStats.total} />
            <StatCard title="Reading" value={libraryStats.reading} />
            <StatCard title="Completed" value={libraryStats.completed} />
            <StatCard title="To Read" value={libraryStats.to_read} />
          </div>
          <div className="mt-4">
            <ProgressBar
              percentage={
                libraryStats.total
                  ? (libraryStats.completed / libraryStats.total) * 100
                  : 0
              }
            />
          </div>
        </section>

        {/* GOALS & ACHIEVEMENTS */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Goals & Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {goals.map((g) => (
              <StatCard key={g.id} title={g.title} value={`${g.progress}%`} />
            ))}
            {achievements.map((a) => (
              <StatCard
                key={a.id}
                title={a.title}
                value={a.completed ? "✅" : "❌"}
              />
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            Book Reviews
          </h2>
          <Card className="border border-slate-200 shadow-sm p-6 space-y-4">
            <select
              className="w-full border p-2 rounded"
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                fetchReviewsForBook(e.target.value);
              }}
            >
              <option value="">Select Book</option>
              {library.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.title}{" "}
                  {b.avgRating != null ? ` - ${b.avgRating.toFixed(1)} ⭐` : ""}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <label className="block font-medium">Rating:</label>
              <select
                className="border p-1 rounded"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                onClick={handleAddReview}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Submit Review
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-slate-400">No reviews yet</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border p-2 rounded">
                    <StarRating rating={r.rating} />
                    <p>{r.comment}</p>
                  </div>
                ))
              )}
            </div>
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
      <div className="mt-2">{value}</div>
    </CardContent>
  </Card>
);

export default DashboardPage;
