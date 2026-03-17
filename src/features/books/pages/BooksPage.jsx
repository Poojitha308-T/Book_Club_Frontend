import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, ArrowLeft, Loader2, BookText, Filter } from "lucide-react";
import { getAllBooks, createBook, updateBook, deleteBook } from "../books.api";
import { addBookToLibrary } from "@/features/library/library.api";
import BookCard from "../components/BookCard";
import BookFormModal from "../components/BookFormModal";
import { useNavigate } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    image_url: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      setBooks(res.books || res.data || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      description: book.description || "",
      image_url: book.image_url || "",
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      genre: "",
      description: "",
      image_url: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data);
        await fetchBooks();
        toast.success("Book updated successfully");
      } else {
        const res = await createBook(data);
        setBooks((prevBooks) => [...prevBooks, res.book]);
        toast.success("Book created successfully");
      }
      setModalOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleAddToLibrary = async (bookId) => {
    try {
      await addBookToLibrary(bookId);
      toast.success("Book added to library!");
    } catch (error) {
      console.error("Add to library failed:", error);
      toast.error("Failed to add book to library");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest transition-all hover:gap-3"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                The <span className="text-indigo-600">Catalogue</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
                Curate and manage your digital library collection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              New Entry
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Fetching Books...</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddToLibrary={handleAddToLibrary}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <BookText className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold text-lg">Your library is currently empty</p>
                <button onClick={handleAdd} className="mt-4 text-indigo-600 font-bold hover:underline">Add your first book</button>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <BookFormModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={handleSubmit}
            formData={formData}
            isEdit={!!editingBook}
          />
        )}
      </div>
    </div>
  );
};

export default BooksPage;