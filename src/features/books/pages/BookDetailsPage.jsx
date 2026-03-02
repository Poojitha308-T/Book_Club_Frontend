import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../books.api";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await getBookById(id);
        // Handle response structure flexibly
        setBook(res.book || res.data || res);
      } catch (error) {
        console.error("Failed to fetch book:", error);
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-500">
        <p className="text-xl">Book not found</p>
        <Link to="/books" className="mt-4 text-indigo-600 hover:underline">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/books"
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Books
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/3 bg-gray-100 relative min-h-[300px] md:min-h-0">
              <img
                src={book.image_url || "https://via.placeholder.com/400x600?text=No+Cover"}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                {book.genre && (
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                    {book.genre}
                  </span>
                )}
                {book.average_rating && (
                  <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                    <span>★</span> {book.average_rating}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(book.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {book.description || "No description provided."}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                  Read Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;