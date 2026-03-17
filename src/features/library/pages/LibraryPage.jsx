import { useEffect, useState } from "react";
import { getUserLibrary, addBookToLibrary, removeBookFromLibrary } from "../library.api";
import { getAllBooks } from "@/features/books/books.api";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { BookPlus, Library, Trash2, Star, BookOpen, Bookmark } from "lucide-react";

const LibraryPage = () => {
  const [library, setLibrary] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("to_read");
  const [loading, setLoading] = useState(true);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
        const allBooksRes = await getAllBooks();
        setBooks(allBooksRes.books ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch library or books");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  useEffect(() => {
    const libIds = library.map((b) => b.book_id);
    setFilteredBooks(books.filter((b) => !libIds.includes(b.id)));
  }, [books, library]);

  const handleAddToLibrary = async () => {
    if (!selectedBook) return toast.error("Select a book to add");
    try {
      const res = await addBookToLibrary(selectedBook, selectedStatus);
      if (res.success) {
        toast.success(res.message || "Book added to library");
        setSelectedBook("");
        setSelectedStatus("to_read");
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
      } else {
        toast.error(res.message || "Failed to add book");
      }
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    }
  };

  const handleRemoveFromLibrary = async (bookId) => {
    if (!bookId) return;
    try {
      const res = await removeBookFromLibrary(bookId);
      if (res.success) {
        toast.success("Book removed from library");
        const libRes = await getUserLibrary();
        setLibrary(libRes.library ?? []);
      } else {
        toast.error(res.message || "Failed to remove book");
      }
    } catch (err) {
      toast.error("Failed to remove book");
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      to_read: "bg-amber-100/10 text-amber-500 border-amber-500/20",
      reading: "bg-blue-100/10 text-blue-500 border-blue-500/20",
      completed: "bg-emerald-100/10 text-emerald-500 border-emerald-500/20",
    };
    const labels = { to_read: "To Read", reading: "Reading", completed: "Completed" };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="w-full px-6 py-10 max-w-7xl mx-auto space-y-12 min-h-screen transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Library className="text-indigo-600 dark:text-indigo-400" size={36} /> Personal Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Organize your reading journey and track your progress.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
          <p className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">{library.length} Books Collected</p>
        </div>
      </div>

      {/* Add Book Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookPlus className="text-slate-400 dark:text-slate-500" size={20} />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Expand Collection</h2>
        </div>
        
        <Card className="border-none shadow-xl shadow-slate-200/60 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden border dark:border-slate-800">
          <CardContent className="p-8 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Select Masterpiece</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-700 dark:text-slate-200 focus:ring-2 ring-indigo-500 transition-all outline-none cursor-pointer"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="" className="dark:bg-slate-900">Choose a book to add...</option>
                {filteredBooks.map((b) => (
                  <option key={b.id} value={b.id} className="dark:bg-slate-900">{b.title}</option>
                ))}
              </select>
            </div>

            <div className="lg:w-64 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Status</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-700 dark:text-slate-200 focus:ring-2 ring-indigo-500 transition-all outline-none cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="to_read" className="dark:bg-slate-900">To Read</option>
                <option value="reading" className="dark:bg-slate-900">Reading</option>
                <option value="completed" className="dark:bg-slate-900">Completed</option>
              </select>
            </div>

            <div className="lg:pt-6">
              <button
                onClick={handleAddToLibrary}
                className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                Add to Shelf
              </button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Library List */}
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Bookmark className="text-slate-400 dark:text-slate-500" size={20} />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">My Shelf</h2>
        </div>

        {library.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Library className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400 font-bold">Your library is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {library.map((b) => (
              <div
                key={b.book_id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2"
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <BookOpen size={20} />
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {b.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    {b.avgRating != null ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <span className="text-xs font-black text-amber-700 dark:text-amber-400">{b.avgRating.toFixed(1)}</span>
                      </div>
                    ) : <div />}
                    
                    <button 
                      onClick={() => handleRemoveFromLibrary(b.book_id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className={`h-1.5 w-full ${
                  b.status === 'completed' ? 'bg-emerald-500' : 
                  b.status === 'reading' ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;