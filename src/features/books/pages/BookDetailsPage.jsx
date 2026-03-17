import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../books.api";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, User, BookOpen, Star, Share2 } from "lucide-react";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await getBookById(id);
        setBook(res.book || res.data || res);
      } catch (error) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Opening Archives...</p>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Book Cover Showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4.5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-8 border-slate-50 dark:border-slate-900">
              <img
                src={book.image_url || "https://via.placeholder.com/400x600?text=No+Cover"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7 flex flex-col py-6">
            <div className="flex items-center gap-4 mb-6">
              {book.genre && (
                <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                  {book.genre}
                </span>
              )}
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="font-black text-sm">{book.average_rating || "N/A"}</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-4">
              {book.title}
            </h1>
            
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 tracking-tight">
              by {book.author}
            </p>

            <div className="flex items-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest mb-10 pb-10 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-300" />
                {new Date(book.created_at).getFullYear()}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-slate-300" />
                Digital Copy
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4">The Synopsis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                {book.description || "No summary currently available for this title."}
              </p>
            </div>

            <div className="mt-auto pt-12 flex flex-wrap gap-4">
              <button className="flex-1 min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                Start Reading
              </button>
              <button className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;