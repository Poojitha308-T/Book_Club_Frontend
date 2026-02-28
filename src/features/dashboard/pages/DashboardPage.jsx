import { useEffect, useState } from "react";
import { getDashboardStats } from "../dashboard.api";
import { getUserLibrary, addBookToLibrary } from "@/features/library/library.api";
import { getAllBooks } from "@/features/books/books.api";
import { getBookReviews, addBookReview } from "@/features/reviews/reviews.api";
import { toast } from "react-toastify";
import { Card, CardContent } from "../../../components/ui/card";

// ⭐ Star rating component
const StarRating = ({ rating = 0, max = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, idx) => (
        <span key={`full-${idx}`} className="text-yellow-400 text-lg">★</span>
      ))}
      {halfStar && <span className="text-yellow-400 text-lg">⯨</span>}
      {Array(emptyStars).fill(0).map((_, idx) => (
        <span key={`empty-${idx}`} className="text-gray-300 text-lg">★</span>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, totalReviews: 0, totalDiscussions: 0 });
  const [libraryStats, setLibraryStats] = useState({ total: 0, reading: 0, completed: 0, to_read: 0 });
  const [books, setBooks] = useState([]);
  const [library, setLibrary] = useState([]);
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

        setStats({
          totalUsers: statsRes?.data?.totalUsers ?? 0,
          totalBooks: statsRes?.data?.totalBooks ?? 0,
          totalReviews: statsRes?.data?.totalReviews ?? 0,
          totalDiscussions: statsRes?.data?.totalDiscussions ?? 0,
        });

        setBooks(booksRes?.books ?? []);
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

  // 🔹 Merge library with book titles and avg ratings
  const fetchLibraryWithTitlesAndRatings = async (allBooks) => {
    try {
      const libraryRes = await getUserLibrary();
      const libBooks = libraryRes?.library ?? [];

      const libWithTitles = await Promise.all(
        libBooks.map(async (b) => {
          const bookInfo = allBooks.find(book => book.id === b.book_id);

          // ⚡ Fetch reviews individually, errors won't break library
          let avgRating = null;
          try {
            const revRes = await getBookReviews(b.book_id);
            const bookReviews = revRes.reviews ?? [];
            avgRating = bookReviews.length
              ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
              : null;
          } catch (err) {
            console.warn(`No reviews for book ${b.book_id}`);
          }

          return {
            ...b,
            title: bookInfo?.title || "Unknown",
            avgRating,
          };
        })
      );

      setLibrary(libWithTitles);

      setLibraryStats({
        total: libWithTitles.length,
        reading: libWithTitles.filter(b => b.status === "reading").length,
        completed: libWithTitles.filter(b => b.status === "completed").length,
        to_read: libWithTitles.filter(b => b.status === "to_read").length,
      });
    } catch (err) {
      console.error("Failed to fetch library with titles:", err);
      setLibraryStats({ total: 0, reading: 0, completed: 0, to_read: 0 });
    }
  };

  // 🔹 Add book to library
  const handleAddToLibrary = async () => {
    if (!selectedBook) return toast.error("Please select a book");
    try {
      const res = await addBookToLibrary(selectedBook, selectedStatus);
      if (res.success) {
        toast.success("Book added to library");
        setSelectedBook("");
        setSelectedStatus("to_read");
        await fetchLibraryWithTitlesAndRatings(books);
      } else {
        toast.error(res.message || "Failed to add book");
      }
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    }
  };

  // 🔹 Fetch reviews for selected book
  const fetchReviewsForBook = async (bookId) => {
    if (!bookId) return setReviews([]);
    try {
      const res = await getBookReviews(bookId);
      setReviews(res.reviews ?? []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    }
  };

  // 🔹 Add review
  const handleAddReview = async () => {
    if (!selectedBook || !reviewText.trim()) return toast.error("Select a book and write a review");
    try {
      const res = await addBookReview(selectedBook, reviewRating, reviewText);
      if (res.success) {
        toast.success("Review added");
        setReviewText("");
        setReviewRating(5);
        await fetchLibraryWithTitlesAndRatings(books);
        fetchReviewsForBook(selectedBook);
      } else {
        toast.error(res.message || "Failed to add review");
      }
    } catch (err) {
      toast.error("Failed to add review");
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;

  return (
    <div className="w-full overflow-x-hidden">
      <main className="px-6 py-10 space-y-10 max-w-7xl mx-auto">

        {/* PLATFORM OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} />
            <StatCard title="Total Books" value={stats.totalBooks} />
            <StatCard title="Total Reviews" value={stats.totalReviews} />
            <StatCard title="Total Discussions" value={stats.totalDiscussions} />
          </div>
        </section>

        {/* ADD BOOK TO LIBRARY */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Add Book To Library</h2>
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <select
                className="w-full border p-2 rounded"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="">Select Book</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
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

        {/* LIBRARY OVERVIEW STATS */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">My Library Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Books" value={libraryStats.total} />
            <StatCard title="Reading" value={libraryStats.reading} />
            <StatCard title="Completed" value={libraryStats.completed} />
            <StatCard title="To Read" value={libraryStats.to_read} />
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Book Reviews</h2>
          <Card className="border border-slate-200 shadow-sm p-6 space-y-4">
            <select
              className="w-full border p-2 rounded"
              value={selectedBook}
              onChange={(e) => {
                const bookId = e.target.value;
                setSelectedBook(bookId);
                fetchReviewsForBook(bookId);
              }}
            >
              <option value="">Select Book</option>
              {library.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.title} {b.avgRating != null ? ` - ${b.avgRating.toFixed(1)} ⭐` : ""}
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
                {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r}</option>)}
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