import { useEffect, useState } from "react";
import { getDashboardStats } from "../dashboard.api";
import { getUserLibrary, addBookToLibrary } from "@/features/library/library.api";
import { getAllBooks } from "@/features/books/books.api";
import { getBookReviews, addBookReview } from "@/features/reviews/reviews.api";
import { getUserGoals } from "@/features/goals/goals.api";
import { getUserAchievements } from "@/features/achievements/achievements.api";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Target, Star, MessageSquare, Users, Bell, Calendar, PlusCircle } from "lucide-react";

// ⭐ Star rating component
const StarRating = ({ rating = 0, max = 5 }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, idx) => (
        <Star
          key={idx}
          size={16}
          className={`${idx < fullStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        />
      ))}
    </div>
  );
};

// ⭐ ProgressBar component
const ProgressBar = ({ percentage, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
      <span>{label}</span>
      <span>{Math.round(percentage)}%</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
      <div
        className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
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
        const achievementsRes = await getUserAchievements();

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
        setAchievements(achievementsRes?.achievements ?? achievementsRes?.data ?? []);

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
              ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
              : null;
          } catch {}
          return { ...b, title: bookInfo?.title || "Unknown", avgRating };
        })
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

  const fetchReviewsForBook = async (bookId) => {
    if (!bookId) return setReviews([]);
    try {
      const reviewsData = await getBookReviews(bookId);
      setReviews(reviewsData ?? []);
    } catch (err) {
      setReviews([]);
      toast.error("Failed to fetch reviews");
    }
  };

  const handleAddReview = async () => {
    if (!selectedBook || !reviewText.trim()) {
      toast.error("Please fill in all review fields");
      return;
    }
    try {
      await addBookReview(selectedBook, reviewRating, reviewText);
      toast.success("Review added successfully!");
      setReviewText("");
      setReviewRating(5);
      fetchReviewsForBook(selectedBook);
      
      const updatedLibrary = library.map((b) =>
        b.book_id === selectedBook
          ? {
              ...b,
              avgRating: reviews.length
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) + reviewRating) / (reviews.length + 1)
                : reviewRating,
            }
          : b
      );
      setLibrary(updatedLibrary);
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="font-medium text-slate-500">Curating your experience...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pb-20">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reader Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening in your library today.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* TOP STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Community" value={stats.totalUsers} icon={<Users className="text-blue-500" />} subtitle="Active Users" />
          <StatCard title="Catalogue" value={stats.totalBooks} icon={<BookOpen className="text-indigo-500" />} subtitle="Books Available" />
          <StatCard title="Engagement" value={stats.totalReviews} icon={<MessageSquare className="text-purple-500" />} subtitle="Total Reviews" />
          <StatCard title="Meetings" value={stats.upcomingMeetings?.length ?? 0} icon={<Calendar className="text-orange-500" />} subtitle="Upcoming events" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Library & Actions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* MY LIBRARY STATUS */}
            <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" /> My Library Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="text-2xl font-bold text-indigo-600">{libraryStats.total}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600">{libraryStats.reading}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reading</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-2xl font-bold text-emerald-600">{libraryStats.completed}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Finished</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-2xl font-bold text-amber-600">{libraryStats.to_read}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Queue</p>
                  </div>
                </div>
                <ProgressBar 
                  percentage={libraryStats.total ? (libraryStats.completed / libraryStats.total) * 100 : 0} 
                  label="Overall Library Completion" 
                />
              </CardContent>
            </Card>

            {/* REVIEWS SECTION */}
            <Card className="border-none shadow-md bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" /> Write a Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Book</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-indigo-500"
                      value={selectedBook}
                      onChange={(e) => {
                        setSelectedBook(e.target.value);
                        fetchReviewsForBook(e.target.value);
                      }}
                    >
                      <option value="">Choose a book from library...</option>
                      {library.map((b) => (
                        <option key={b.book_id} value={b.book_id}>
                          {b.title} {b.avgRating ? `(${b.avgRating.toFixed(1)} ⭐)` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex items-center gap-3">
                      <select
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-indigo-500"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                      <StarRating rating={reviewRating} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Thoughts</label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm min-h-[100px] outline-indigo-500 transition-all focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="What did you think of the characters, the plot, or the writing style?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Post Review
                </button>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Recent Reviews for this Book</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl italic text-slate-400">
                        No reviews yet. Be the first to share your thoughts!
                      </div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-2">
                          <StarRating rating={r.rating} />
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Quick Add & Progress */}
          <div className="space-y-8">
            
            {/* QUICK ADD */}
            <Card className="border-none shadow-md bg-white dark:bg-slate-900 border-t-4 border-t-indigo-600">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle size={20} className="text-indigo-600" /> Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-indigo-500"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                >
                  <option value="">Discover books...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-indigo-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="to_read">Wishlist (To Read)</option>
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Finished</option>
                </select>
                <button
                  onClick={handleAddToLibrary}
                  className="w-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold py-2.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Add to Library
                </button>
              </CardContent>
            </Card>

            {/* GOALS */}
            <Card className="border-none shadow-md bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target size={20} className="text-rose-500" /> Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {goals.length === 0 ? (
                  <p className="text-center text-slate-400 py-4 italic">No goals set yet.</p>
                ) : (
                  goals.map((g) => {
                    const bookProgress = g.target_books ? g.completed_books / g.target_books : 0;
                    const pageProgress = g.target_pages ? g.completed_pages / g.target_pages : 0;
                    const overallProgress = Math.round(((bookProgress + pageProgress) / 2) * 100);
                    return (
                      <ProgressBar key={g.id} label={g.title} percentage={overallProgress} />
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* ACHIEVEMENTS */}
            <Card className="border-none shadow-md bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {achievements.length === 0 ? (
                    <p className="text-center text-slate-400 py-4 italic">Begin reading to unlock!</p>
                  ) : (
                    achievements.map((a) => (
                      <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl border ${a.completed ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-60"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${a.completed ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
                            <Trophy size={16} />
                          </div>
                          <span className="text-sm font-medium">{a.title}</span>
                        </div>
                        {a.completed ? <span className="text-emerald-500">✅</span> : <span className="text-slate-300">🔒</span>}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* STATS CARD COMPONENT */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, subtitle }) => (
  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default DashboardPage;